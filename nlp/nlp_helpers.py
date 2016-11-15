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
from nltk.tokenize import RegexpTokenizer
from stop_words import get_stop_words
from nltk.stem.porter import PorterStemmer

# Copyright © 2016 Joachim Muth <joachim.henri.muth@gmail.com>
#
# Distributed under terms of the MIT license.

filter_list = []


def cleaning_pipeline(df):
    """
    FOR THE MOMENT ONLY FOR FRENCH
    Process the whole cleaning pipeline for the purpose of NLP content extraction
    :param df:
    :return:
    """
    clean_df = clean_html(df)
    clean_df = lower(clean_df)
    clean_df = tokenize(clean_df)
    clean_df = remove_stop_words(clean_df, 'fr')
    clean_df = remove_short_words(clean_df)
    clean_df = remove_from_filter_list(clean_df, filter_list)
    clean_df = stem(clean_df)
    return clean_df


def lower(df):
    return df.apply(str.lower)


def tokenize(df):
    tokenizer = RegexpTokenizer(r'\w+')
    return df.apply(tokenizer.tokenize)


def remove_stop_words(df, language):
    def _inner_remove_stop_word(list_words):
        clean_list = [i for i in list_words if i not in stop_list]
        return clean_list

    recognized_language = ['en', 'fr', 'de', 'it']
    if language not in recognized_language:
        print("[ERROR] Language ", language, "not recognized. Choose between ", recognized_language)
        return

    stop_list = get_stop_words(language)
    # add condition for word greater than 1 or 2
    return df.apply(_inner_remove_stop_word)


def remove_from_filter_list(df, filter_list):
    def _inner_helper(list_words):
        clean_list = [i for i in list_words if i not in filter_list]
        return clean_list

    return df.apply(_inner_helper)


def remove_short_words(df):
    def _inner_helper(list_words):
        clean_list = [i for i in list_words if len(i) > 3]
        return clean_list

    return df.apply(_inner_helper)


def stem(df):
    # Create p_stemmer of class PorterStemmer
    p_stemmer = PorterStemmer()

    def _inner_stemm_words(list_words):
        texts = [p_stemmer.stem(i) for i in list_words]
        return texts

    return df.apply(_inner_stemm_words)


def clean_html(df):
    return df.apply(_inner_clean_html)


def _inner_clean_html(text_html):
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
    print("[INFO] Finished. Files created in folder '", folder, "' of size ~ %.2f" % (float(size_folder) / 1000000.),
          "mb")


def get_size(start_path='.'):
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(start_path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            total_size += os.path.getsize(fp)
    return total_size
