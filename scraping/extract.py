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
def parsing_data(base_url):
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


def parties():
    # Url to get all the party
    url_party = "https://ws.parlament.ch/odata.svc/Party?$filter=Language%20eq%20'FR'"
    df_party = parsing_data(url_party)
    # Drop the Language Column
    df_party = df_party.drop('Language', axis=1)

    df_party.to_csv('data/parties.csv')

    return df_party


def persons():
    limit_api = 1000
    data_frames = []
    i = 0
    time_out = 0
    while True:
        url_persons = "https://ws.parlament.ch/odata.svc/Person?&$filter=Language%20eq%20'FR'%20and%20ID%20ge%20" \
                      + str(i) \
                      + "%20and%20ID%20lt%20" + str(i + limit_api)

        df_persons = parsing_data(url_persons)

        # stop when we reach the end of the data
        # or after 10 iteration to avoid swiss police to knock at our door
        if df_persons.shape == (0, 0) or time_out > 10:
            break

        data_frames.append(df_persons)
        i += limit_api
        time_out += 1

    return pd.concat(data_frames)

