#! /usr/bin/env python
# coding=utf-8
import os

import pandas as pd
import urllib
import xml.etree.ElementTree as ET
import io
import itertools as IT


# Copyright © 2016 Joachim Muth <joachim.henri.muth@gmail.com>
#
# Distributed under terms of the MIT license.


class Scraper:
    """
    Scraper for parlament.ch

    scraper.get(table_name): get the table, write it in csv file, return a pandas.data_frame
    """

    def __init__(self, time_out=10, language='FR'):
        self.tables = {'party': 'Party',
                       'person': 'Person',
                       'member_council': 'MemberCouncil',
                       'council': 'Council'}
        self.url_base = "https://ws.parlament.ch/odata.svc/"
        self.url_count = "$count"
        self.url_lang_filter = "$filter=Language%20eq%20'" + language + "'"
        self.folder = "data"
        self.time_out = time_out
        self.limit_api = 1000

    def get(self, table_name):
        """
        Load the table_name from parlament.ch
        Write a csv file in self.folder / table_name
        :return (pandas.data_frame): table
        """
        table_size = self.count(table_name)
        if table_name == 'BusinessRole':
            df = self._inner_get_business_role(table_name)
        elif table_name == 'BusinessStatus':
            df = self._inner_get_big_table_skip(table_name)
        elif table_size > 10000:
            df = self._inner_get_big_table_ids(table_name)
        elif table_size > 900:
            df = self._inner_get_big_table_skip(table_name)
        else:
            df = self._inner_get_small_table(table_name)

        self._inner_write_file(df, table_name)
        return df

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

    def _inner_get_and_parse(self, url):
        """
        Send GET request to parlament.ch and parse the return XML file to a pandas.data_frame
        :param url: (str) GET url request
        :return: (pandas.data_frame) parsed XML
        """
        print("GET:", url)
        with urllib.request.urlopen(url) as url:
            s = url.read()
        # root = ET.fromstring(s)
        root = self._inner_error_handling_xmlfromstring(s)

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

    def _inner_error_handling_xmlfromstring(self, content):
        """ Print XML if error while parsing (mainly due to server API timeout)"""
        try:
            tree = ET.fromstring(content)
        except ET.ParseError as err:
            lineno, column = err.position
            line = next(IT.islice(io.BytesIO(content), lineno))
            caret = '{:=>{}}'.format('^', column)
            err.msg = '{}\n{}\n{}'.format(err, line, caret)
            raise
        return tree

    def _inner_write_file(self, table, table_name):
        """ Write table in csv file inside self.folder / table_name"""
        self._inner_check_folder()
        table.to_csv(self.folder + '/' + table_name + '.csv')

    def _inner_get_big_table_skip(self, table_name):
        """
        Loop URL request on table by step of 1000 and load data until reaches the end
        Time Out after self.time_out iterations
        :param table_name: Name of the wished table
        :return: (pandas.data_frame) table
        """
        # url
        base = self.url_base
        language = self.url_lang_filter

        # loop parameters
        limit_api = self.limit_api
        data_frames = []
        i = 0
        top = 1000
        skip = 0
        while True:
            url = base + table_name + '?' + "$top=" + str(top) + \
                  '&' + language + \
                  '&' + "$skip=" + str(skip)

            df = self._inner_get_and_parse(url)

            # stop when we reach the end of the data
            if df.shape == (0, 0):
                break

            # stop after 10 iteration to avoid swiss police to knock at our door
            if i > self.time_out:
                print("Loader timed out after ", i, " iterations. Data frame IDs are greater than ", top)
                break

            data_frames.append(df)
            # top += limit_api
            skip += limit_api
            i += 1

        # concat all downloaded tables
        df = pd.concat(data_frames, ignore_index=True)

        # check if we really download the whole table
        self._inner_check_size(df, table_name)

        return df

    def _inner_get_big_table_ids(self, table_name):
        """
        "skip" odata attribute leads to time out the parlament.ch server. Here we use id's to get directly intervals of
        items.
        Less safe than "skip version, because could stop if a big ID interval is not used (normally not the case)
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
        limit_api = self.limit_api
        data_frames = []
        id_ = self._inner_get_smaller_id(table_name)
        i = 0
        n_downloaded = 0
        expected_size = self.count(table_name)
        while True:
            url = base + table_name + '?' + language + '%20and%20' + id_from + str(id_) + id_to + str(id_ + limit_api)

            df = self._inner_get_and_parse(url)

            # stop when we reach the end of the data
            # if df.shape == (0, 0):
            #     break

            # add number of elements downloaded
            n_downloaded += df.shape[0]

            # stop when downloaded the whole table
            if n_downloaded >= expected_size:
                break

            # stop after 10 iteration to avoid swiss police to knock at our door
            if i > self.time_out:
                print("Loader timed out after ", i, " iterations. Data frame IDs are greater than ", id_)
                break

            data_frames.append(df)
            id_ += limit_api
            i += 1

        # concat all downloaded tables
        df = pd.concat(data_frames, ignore_index=True)

        # check if we really download the whole table
        self._inner_check_size(df, table_name)

        return df

    def _inner_get_small_table(self, table_name):
        """
        Simple get request with language filer
        :param table_name:
        :return:
        """
        url = self.url_base + table_name + '?' + self.url_lang_filter
        df = self._inner_get_and_parse(url)
        self._inner_check_size(df, table_name)
        return df

    def _inner_check_size(self, df, table_name):
        expected_size = self.count(table_name)
        if df.shape[0] != expected_size:
            print("[ERROR] in scraping table", table_name, "expected size of", expected_size, "but is", df.shape[0])
        else:
            print("[OK] table " + table_name + " correctly scraped, df.shape = ", df.shape[0], "as expected")

    def _inner_check_folder(self):
        """ check if folder exists to avoid error and create it if not """
        if not os.path.exists(self.folder):
            os.makedirs(self.folder)

    def _inner_get_smaller_id(self, table_name):
        url = self.url_base + table_name + '?' + self.url_lang_filter
        df = self._inner_get_and_parse(url)
        return int(df.ID[0])

    def _inner_get_business_role(self, table_name):
        """
        Special case of Table BusinessRole which has non-trivial ID.
        Filter result base on BusinessNumber (which is a random attribute) and iterate over it
        At each iteratino process an _inner_get_big_table_skip method

        Time Out after self.time_out iterations
        :param table_name: Name of the wished table
        :return: (pandas.data_frame) table
        """
        # url
        base = self.url_base
        language = "$filter=Language%20eq%20%27FR%27"
        id_ = 19000000
        step_id = 10000

        # id filter (too long)
        id_from = "BusinessNumber%20ge%20"
        id_to = "%20and%20BusinessNumber%20lt%20"

        # loop parameters
        data_frames = []
        i = 0
        top = 1000
        skip = 0
        limit_api = self.limit_api
        while True:
            while True:
                url = base + table_name + '?' + "$top=" + str(top) + \
                      '&' + language + \
                      '%20and%20' + id_from + str(id_) + id_to + str(id_ + step_id) + \
                      '&' + "$skip=" + str(skip)

                df = self._inner_get_and_parse(url)

                # stop when we reach the end of the data
                if df.shape == (0, 0):
                    break

                # # stop when we reach the end of the data
                # url_count = base + table_name + "/$count?" + "$top=" + str(top) + \
                #             '&' + language + \
                #             '&' + id_from + str(id_) + id_to + str(id_ + step_id) + \
                #             '&' + "$skip=" + str(skip)
                # print(self._inner_url_count(url_count))
                # if self._inner_url_count(url_count) == 0:
                #     break

                # stop after 10 iteration to avoid swiss police to knock at our door
                if i > self.time_out:
                    print("Loader timed out after ", i, " iterations. Data frame IDs are greater than ", top)
                    break

                data_frames.append(df)
                # top += limit_api
                skip += limit_api
                i += 1

            if id_ > 22000000:
                break

            id_ += step_id
            skip = 0

        # concat all downloaded tables
        df = pd.concat(data_frames, ignore_index=True)

        # check if we really download the whole table
        self._inner_check_size(df, table_name)

        return df
