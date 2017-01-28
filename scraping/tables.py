#! /usr/bin/env python
# coding=utf-8

# Copyright © 2016 Joachim Muth <joachim.h.muth@gmail.com>
#
# Distributed under terms of the MIT license.

import json
import pandas as pd
import numpy as np
import scipy.sparse as sp
import os.path
import sys
from collections import defaultdict


def symmetrize(a):
    return a + a.T - np.diag(a.diagonal())


class Tables:
    def check_data_exists(self):
        for table_name in self.needed_tables:
            if not os.path.isfile('data/' + table_name + '.csv'):
                sys.exit('[ERROR] Needed table ' + table_name)

    def __init__(self):
        self.needed_tables = ['Business',
                              'MemberCouncil',
                              'Tags',
                              'BusinessRole',
                              'Active_People',
                              'Transcript',
                              'Session',
                              'Person']
        self.check_data_exists()
        self.df = {}
        for table in self.needed_tables:
            self.df[table] = pd.read_csv('data/' + table + '.csv')

    def cosigner(self):
        """ Number of time two person have an author-cosigner relation"""
        # TODO: fill the matrix in a symmetric way (upper right corner first) and then use symmetrize function

        df_role = self.df['BusinessRole']
        df_member = self.df['MemberCouncil']

        # create cosigners table
        cosigners = df_role.loc[(df_role.MemberCouncilNumber.notnull()) & (df_role.RoleName == 'Cosignataire')]
        cosigners = cosigners[['BusinessNumber', 'MemberCouncilNumber']]
        cosigners = cosigners.astype(int)
        print("Cosigners table shape: ", cosigners.shape)

        # create authors table
        authors = df_role.loc[(df_role.MemberCouncilNumber.notnull()) & (df_role.RoleName == 'Auteur')]
        authors = authors[['BusinessNumber', 'MemberCouncilNumber']]
        authors = authors.astype(int)
        print("Authors table shape: ", authors.shape)

        # create the sparse matrix of right size
        max_id = df_member.PersonNumber.max()
        friends = sp.lil_matrix((max_id, max_id), dtype=np.int32)

        # fill the sparse matrix
        def add_to_friend(author, cosigners):
            for cosigner in cosigners:
                friends[author, cosigner] += 1
                friends[cosigner, author] += 1

        def fill_matrix(authors, table_cosigners):
            for (auteur_num, business_num) in zip(authors.MemberCouncilNumber, authors.BusinessNumber):
                cosigners = table_cosigners.loc[table_cosigners.BusinessNumber == business_num]['MemberCouncilNumber']
                if cosigners.size != 0:
                    add_to_friend(auteur_num, cosigners)

        fill_matrix(authors, cosigners)
        print("Matrix created of size ", friends.nonzero())

        return friends

    def author(self):
        """ Number of times a member of council is author of an initiative"""
        df_role = self.df['BusinessRole']
        number_initiative = df_role.loc[
            (df_role.MemberCouncilNumber.notnull()) & (df_role.RoleName == 'Auteur')
            ].groupby('MemberCouncilNumber').size()
        number_initiative = number_initiative.to_frame(name='author')
        number_initiative = number_initiative.reset_index().astype(int)
        return number_initiative

    def interest(self, cosign=True, auth=True):
        """ Most frequent tags in redacted or signed initiative """
        df_business = self.df['Business']
        df_role = self.df['BusinessRole']
        temp = self.df['Tags']

        # get tag for each business
        df_business_tags = df_business[['ID', 'Tags']].set_index('ID')
        df_business_tags['Tags'].fillna("2500", inplace=True)
        df_business_tags = df_business_tags.dropna(axis=0)

        # create a DataFrame business->tag filled with zero
        topics = pd.DataFrame(index=df_business_tags.index)
        for i in temp.ID:
            topics[i] = 0

        # split the tag "4|8|12" in a list(4, 8, 12)
        df_business_tags['Tags'] = df_business_tags['Tags'].apply(lambda x: x.split('|'))

        # fill the cell of topics table
        def fill_cell(business_number, tags_array):
            for tag in tags_array:
                previous_val = topics.get_value(int(business_number), int(tag))
                topics.set_value(int(business_number), int(tag), int(previous_val + 1))

        for i, tags in zip(df_business_tags.index, df_business_tags.Tags):
            fill_cell(i, tags)

        # ensure topics has type integer
        topics = topics.astype(int)

        # Get a table with (author, co-signer) and the related business
        authors = df_role.loc[(df_role.MemberCouncilNumber.notnull())]
        if cosign == True and auth == True:
            authors = authors.loc[(authors.RoleName == 'Auteur') | (authors.RoleName == 'Cosignataire')]
        elif cosign == True and auth == False:
            authors = authors.loc[(authors.RoleName == 'Cosignataire')]
        else:
            authors = authors.loc[(authors.RoleName == 'Auteur')]
        authors = authors[['MemberCouncilNumber', 'BusinessNumber']]
        authors = authors.astype(int)

        # Finally join the table of tagged business and author (or co-signer) to check their interest
        interest = authors.join(topics, on='BusinessNumber', how='inner')
        interest = interest.sort_values(by='MemberCouncilNumber')
        interest = interest.reset_index(drop=True)
        interest = interest.groupby('MemberCouncilNumber', as_index=True)[temp.ID].agg(lambda x: x.sum())

        # Some decorations
        interest.columns = temp.TagName
        interest = interest.reset_index()
        return interest

    def active_interest(self, cosign=True, auth=True):
        df_interest = self.interest(cosign, auth)
        df_active = self.df['Active_People']

        df_interest = df_interest[df_interest.MemberCouncilNumber.isin(df_active.PersonNumber)]
        missing = np.array(df_active.PersonNumber[~df_active.PersonNumber.isin(df_interest.MemberCouncilNumber)])

        if len(missing) > 0:
            n = len(df_interest.columns)

            for i in missing:
                arr = np.zeros(n)
                arr[0] = i
                df_interest.loc[-1] = arr
                df_interest.index = df_interest.index + 1

        df_active = df_active.sort_values(by='PersonNumber')
        df_interest = df_interest.sort_values(by='MemberCouncilNumber')
        df_interest = df_interest.reset_index()
        df_interest['PersonIdCode'] = df_active.PersonIdCode
        df_interest = df_interest.drop(['index', 'MemberCouncilNumber'], axis=1)

        return df_interest

    def interventions(self, filename=None):
        transcripts = self.df['Transcript']
        sessions = self.df['Session']
        persons = self.df['Person']

        if filename is None:
            filename = 'interventions'

        def word_counter(df):
            if type(df['Text']) == float:
                return 0
            else:
                return len(df['Text'].split())

        def define_year(df):
            return year_dict[df['IdSession']]

        def get_year(df):
            return int(df.StartDate[:4])

        # filter transcription with PersonIdField
        transcripts = transcripts[np.isfinite(transcripts['PersonNumber'])]
        transcripts['PersonNumber'] = transcripts['PersonNumber'].astype(int)

        # filter long intervention
        transcripts['NumberWord'] = transcripts.apply(word_counter, axis=1)
        df_long = transcripts.loc[transcripts.NumberWord > 30]

        # link session number to year
        sessions['StartYear'] = sessions.apply(get_year, axis=1)
        year_dict = sessions['StartYear'].to_dict()
        year_dict = defaultdict(lambda: 0, year_dict)

        # add year field
        df_long['year'] = df_long.apply(define_year, axis=1)

        # table : PersonNumber, year, interventions
        interventions = pd.DataFrame(df_long.groupby(['PersonNumber', 'year']).size().rename('Counts'))
        interventions = interventions.reset_index()

        # table : year, median intervention per person
        median = interventions.groupby('year').agg('median')
        median = median['Counts'].rename('median').astype(int)

        # table personNumber, PersonIdCode
        persons = persons.dropna(axis=0, subset=['PersonNumber', 'PersonIdCode'])
        persons.PersonIdCode = persons.PersonIdCode.astype(int)
        persons = persons.set_index('PersonNumber')
        persons = persons['PersonIdCode']

        # in main table, link to PersonIdCode and median per year
        interventions = interventions.join(persons, how='inner', on='PersonNumber')
        interventions = interventions.join(median, how='inner', on='year')

        # create the dictionnary for Json
        interventions.sort_values(by='PersonIdCode', inplace=True)
        persons_id = interventions.PersonIdCode.unique()

        dic = {}
        for person_id in persons_id:
            arr = list()
            for row in interventions.loc[interventions.PersonIdCode == person_id].values:
                internal_dic = {'year': int(row[1]), 'int': int(row[2]), 'median': int(row[4])}
                arr.append(internal_dic)
            dic[str(person_id)] = arr

        filepath = 'data/' + filename + '.json'
        with open(filepath, 'w') as fp:
            json.dump(dic, fp)
            print("[INFO] JSON created in file ", filepath)

        return interventions