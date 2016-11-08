#! /usr/bin/env python
# coding=utf-8
import pandas as pd
import urllib
import xml.etree.ElementTree as ET

# Copyright © 2016 Joachim Muth <joachim.henri.muth@gmail.com>
#
# Distributed under terms of the MIT license.

"""

"""


# Function to parse the data
def get_and_parse(base_url):
    """
    Send GET request to parlament.ch and parse the return XML file to a pandas.data_frame
    :param base_url: (str) GET url request
    :return: (pandas.data_frame) parsed XML
    """
    print(base_url)
    with urllib.request.urlopen(base_url) as url:
        s = url.read()
    root = ET.fromstring(s)

    dict_ = {}
    base = "{http://www.w3.org/2005/Atom}"
    for child in root.iter(base + 'entry'):
        for children in child.iter(base + 'content'):
            for properties in children:
                for subject in properties:
                    # print(subject.text)
                    s = subject.tag.split('}')
                    if s[1] in dict_:
                        dict_[s[1]].append(subject.text)
                    else:
                        dict_[s[1]] = [subject.text]
    data = pd.DataFrame(dict_)
    return data


def party():
    """
    Load the Party table from parlament.ch
    Remove useless column
    :return: (pandas.data_frame) Party
    """
    # Url to get all the party
    url_party = "https://ws.parlament.ch/odata.svc/Party?$filter=Language%20eq%20'FR'"
    df_party = get_and_parse(url_party)

    # Drop the Language Column
    df_party = df_party.drop('Language', axis=1)

    # Write file
    df_party.to_csv('data/party.csv')

    return df_party


def person():
    """
    Load the Person table from parlament.ch
    Remove useless field
    :return: (pandas.data_frame) Person
    """

    df_person = get_big_table('Person')
    # Drop useless columns (for council)
    # df_person = df_person.drop('BirthPlace_Canton', axis=1)
    # df_person = df_person.drop('BirthPlace_City', axis=1)

    # write file
    df_person.to_csv('data/person.csv')

    return df_person


def member_council():
    table_name = 'MemberCouncil'
    df_member_council = get_big_table(table_name)
    df_member_council.to_csv('data/' + table_name.lower() + '.csv')
    
    return df_member_council


def get_big_table(table_name):
    # url
    base = "https://ws.parlament.ch/odata.svc/"
    table_name += "?"
    language = "$filter=Language%20eq%20'FR'"
    id_from = "ID%20ge%20"
    id_to = "%20and%20ID%20lt%20"

    # loop parameters
    limit_api = 1000
    data_frames = []
    i = 0
    time_out = 0
    while True:
        url = base + table_name + language + '%20and%20' + id_from + str(i) + id_to + str(i + limit_api)

        df = get_and_parse(url)

        # stop when we reach the end of the data
        if df.shape == (0, 0):
            break

        # stop after 10 iteration to avoid swiss police to knock at our door
        if time_out > 10:
            print("Loader timed out after ", time_out, " iterations. Data frame IDs are greater than ", i)
            break

        data_frames.append(df)
        i += limit_api
        time_out += 1

    df = pd.concat(data_frames)
    return df
