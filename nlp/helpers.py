#! /usr/bin/env python
# coding=utf-8

# Copyright © 2016 Joachim Muth <joachim.henri.muth@gmail.com>
#
# Distributed under terms of the MIT license.

import os
import time


def create_corpus(df):
    """
    Create
    :param df: (pandas.data_frame)
    :return:
    """
    folder = 'data'

    check_folder(folder)

    def _inner_create_corpus_one_line(df):
        """ write one text into one file """
        text = df['Text']
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


def check_folder(folder_name):
    """ check if folder exists to avoid error and create it if not """
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)


def load_txt(file_name):
    with open(file_name) as f:
        data = f.readlines()
        data = [x.strip('\n') for x in data]

    return data


def timing(f):
    def wrap(*args):
        time1 = time.time()
        ret = f(*args)
        time2 = time.time()
        print('[INFO] %s took %0.3f s' % (f.__name__, (time2 - time1)))
        return ret

    return wrap
