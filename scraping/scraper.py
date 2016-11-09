#! /usr/bin/env python
# coding=utf-8
import pandas as pd
import urllib
import xml.etree.ElementTree as ET


# Copyright © 2016 Joachim Muth <joachim.henri.muth@gmail.com>
#
# Distributed under terms of the MIT license.


class Scraper:
    """
    Scraper for parlament.ch

    scraper.get(table_name): get the table, write it in csv file, return a pandas.data_frame
    """

    def __init__(self):
        self.tables = {'party': 'Party',
                       'person': 'Person',
                       'member_council': 'MemberCouncil',
                       'council': 'Council'}
        self.url_base = "https://ws.parlament.ch/odata.svc/"
        self.url_count = "$count"
        self.url_lang_filter = "$filter=Language%20eq%20'FR'"
        self.folder = "data"

    # Function to parse the data
    def get_and_parse(self, url):
        """
        Send GET request to parlament.ch and parse the return XML file to a pandas.data_frame
        :param url: (str) GET url request
        :return: (pandas.data_frame) parsed XML
        """
        print("GET:", url)
        with urllib.request.urlopen(url) as url:
            s = url.read()
        root = ET.fromstring(s)

        dict_ = {}
        base = "{http://www.w3.org/2005/Atom}"
        # base = self.base_url
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

    def get(self, table_name):
        """
        Load the table_name from parlament.ch
        Write a csv file in self.folder / table_name
        :return (pandas.data_frame): table
        """
        table_size = self.count(table_name)
        if table_size > 900:
            df = self.get_big_table(table_name)
        else:
            df = self.get_small_table(table_name)

        self.write_file(df, table_name)
        return df

    def write_file(self, table, table_name):
        """ Write table in csv file inside self.folder / table_name"""
        table.to_csv(self.folder + '/' + table_name + '.csv')

    def count(self, table_name):
        """
        Count request for parlament.ch server
        :param table_name:
        :return: number of entries in table_name
        """
        url = self.url_base + table_name + "/$count?$filter=Language%20eq%20'FR'"
        with urllib.request.urlopen(url) as response:
            n = response.read()
        # get the number from the bytes
        n = int(str(n).split("'")[1])
        return n

    def get_big_table(self, table_name):
        """
        Loop URL request on table by step of 1000 id's and load data until reaches the end
        Time Out after 10 iterations
        :param table_name: Name of the wished table
        :return: (pandas.data_frame) table
        """
        # url
        base = self.url_base
        language = self.url_lang_filter
        id_from = "ID%20ge%20"
        id_to = "%20and%20ID%20lt%20"

        # loop parameters
        limit_api = 1000
        data_frames = []
        i = 0
        time_out = 0
        while True:
            url = base + table_name + '?' + language + '%20and%20' + id_from + str(i) + id_to + str(i + limit_api)

            df = self.get_and_parse(url)

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

    def get_small_table(self, table_name):
        """
        Simple get request with language filer
        :param table_name:
        :return:
        """
        url = self.url_base + table_name + '?' + self.url_lang_filter
        return self.get_and_parse(url)
