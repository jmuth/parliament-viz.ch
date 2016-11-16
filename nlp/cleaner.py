#! /usr/bin/env python
# coding=utf-8

# Copyright © 2016 Joachim Muth <joachim.henri.muth@gmail.com>
#
# Distributed under terms of the MIT license.

from bs4 import BeautifulSoup as BSoup
from nltk.tokenize import RegexpTokenizer
from stop_words import get_stop_words
from nltk.stem.porter import PorterStemmer


def clean_html(text_html):
    clean_text = BSoup(text_html, 'lxml').text
    clean_text = clean_text.replace('\n', ' ').replace('\r', '')
    return clean_text


def tokenize(text):
    tokenizer = RegexpTokenizer(r'\w+')
    return tokenizer.tokenize(text)


def remove_stop_words(list_words):
    """ remove stop word from french + german + english + italian. To be precised ? """
    stop_list = get_stop_words('fr') + get_stop_words('de') + get_stop_words('en') + get_stop_words('it')
    clean_list = [i for i in list_words if i not in stop_list]
    return clean_list


def remove_short_words(list_words, min_size=3):
    clean_list = [i for i in list_words if len(i) >= min_size]
    return clean_list


def stem(list_words):
    # Create p_stemmer of class PorterStemmer
    p_stemmer = PorterStemmer()
    clean_list = [p_stemmer.stem(i) for i in list_words]
    return clean_list


class Cleaner:
    def __init__(self, filter_list=[]):
        self.filter_list = filter_list

    def cleaning_pipeline_series(self, series):
        return series.apply(self.cleaning_pipeline)

    def cleaning_pipeline(self, text):
        """
        FOR THE MOMENT ONLY FOR FRENCH
        Process the whole cleaning pipeline for the purpose of NLP content extraction
        :param text:
        :return:
        """
        clean_text = clean_html(text)
        clean_text = clean_text.lower()
        clean_text = tokenize(clean_text)
        clean_text = remove_stop_words(clean_text)
        clean_text = remove_short_words(clean_text)
        clean_text = self.remove_from_filter_list(clean_text)
        clean_text = stem(clean_text)
        return clean_text

    def remove_from_filter_list(self, list_words):
        clean_list = [i for i in list_words if i not in self.filter_list]
        return clean_list

    def update_filter_list(self, filter_list):
        self.filter_list = filter_list

    def load(self, filename):
        with open(filename) as f:
            content = f.readlines()
        # remove endline marker
        content = [x.strip('\n') for x in content]
        self.filter_list = content

    def save(self, suffix = None):
        filename = "filter_list"
        if suffix is not None:
            filename += "_" + suffix

        file = open(filename + ".txt", 'w')
        for item in self.filter_list:
            file.write("%s\n" % item)