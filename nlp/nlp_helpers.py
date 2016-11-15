#! /usr/bin/env python
# coding=utf-8
import os

import pandas as pd
import urllib
import xml.etree.ElementTree as ET
import io
import itertools as IT
import nltk
from bs4 import BeautifulSoup as BSoup


# Copyright © 2016 Joachim Muth <joachim.henri.muth@gmail.com>
#
# Distributed under terms of the MIT license.

def clean_html(text_html):
    clean_text = BSoup(text_html, 'lxml').text
    clean_text = clean_text.replace('\n', ' ').replace('\r', '')
    return clean_text

def array_corpus(df):
    def _inner_clean_html(df):
        return clean_html(df['Text'])

    return df.apply(_inner_clean_html, axis=1)



def create_corpus(df):
    """
    Create
    :param df: (pandas.data_frame)
    :return:
    """
    folder = 'data'

    def _inner_create_corpus_one_line(df):
        """ write one text into one file """
        text = clean_html(df['Text'])
        id = df['ID']
        file_name = folder + '/Transcript' + str(id) + '.txt'
        text_file = open(file_name, "w")
        text_file.write(text)
        text_file.close()

    print("[INFO] Start creating corpus")
    df.apply(_inner_create_corpus_one_line, axis=1)
    size_folder = get_size('data/')
    print("[INFO] Finished. Files created in folder '", folder, "' of size ~ %.2f" % (float(size_folder)/1000000.), "mb")


def get_size(start_path = '.'):
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(start_path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            total_size += os.path.getsize(fp)
    return total_size