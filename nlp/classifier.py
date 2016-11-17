#! /usr/bin/env python
# coding=utf-8

# Copyright © 2016 Joachim Muth <joachim.henri.muth@gmail.com>
#
# Distributed under terms of the MIT license.

import gensim

from cleaner import Cleaner
from helpers import check_folder, timing


class Classifier:
    def __init__(self):
        self.lda_model = None
        self.dictionary = None
        self.n_topic = None
        self.n_passes = None
        self.cleaner = Cleaner()
        self.folder_name = "models"

    def define_dictionary(self, texts):
        """
        :param texts: (pandas.core.series.Series)
        :return:
        """
        # construct a document-term matrix
        self.dictionary = gensim.corpora.Dictionary(texts)
        print("[INFO] Dictionary defined")

    @timing
    def define_model(self, texts, n_topics, n_passes):
        if self.dictionary is None:
            print("[ERROR] First define a dictionary")
            return
        self.n_topic = n_topics
        self.n_passes = n_passes
        # converted into a bag-of-words:
        corpus = [self.dictionary.doc2bow(text) for text in texts]
        # train model
        self.lda_model = gensim.models.ldamodel.LdaModel(corpus, num_topics=n_topics, id2word=self.dictionary,
                                                         passes=n_passes)
        print("[INFO] LDA model defined")
        return

    def classify(self, text):
        clean_text = self.cleaner.cleaning_pipeline(text)
        bag_of_word = self.dictionary.doc2bow(clean_text)
        return self.lda_model[bag_of_word]

    def set_cleaner(self, cleaner):
        self.cleaner = cleaner

    def print_model(self, n_topics=20, n_words=10):
        for i, bag in enumerate(self.lda_model.print_topics(num_topics=n_topics, num_words=n_words)):
            print("============")
            print("Cluster ", i, ": ", bag)

    def save(self, suffix=None):
        """ Save with preformed filename t (topics) and p (passes). Optional suffix for extra info """

        filename = "t" + str(self.n_topic) + "_p" + str(self.n_passes)
        if suffix is not None:
            filename += "_" + suffix

        # check if folder exists to avoid error and create it if not
        check_folder(self.folder_name)

        self.lda_model.save(self.folder_name + "/" + filename + "_ldamodel")
        self.dictionary.save(self.folder_name + "/" + filename + "_ldamodel.dict")

    def load(self, filename):
        """ For convenient use, take just the name LDA model file as argument and retrieve dictionary correctly
        if save() method is used """
        self.lda_model = gensim.models.ldamodel.LdaModel.load(filename, mmap='r')
        self.dictionary = gensim.corpora.Dictionary.load(filename + ".dict")
