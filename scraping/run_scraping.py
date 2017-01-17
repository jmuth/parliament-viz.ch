#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyright © 2017 Joachim Muth <joachim.henri.muth@gmail.com>
#
# Distributed under terms of the MIT license.

"""
This script intend to scrap all needed table from parliament.ch
WARNING: slow because of server limitations
"""

from scraper import *

print("[INFO] Start scraping")

scrap = Scraper(time_out=3000000)
scrap.get('Business')
scrap.get('BusinessRole')
scrap.get('BusinessStatus')
scrap.get('BusinessType')
scrap.get('MemberCouncil')
scrap.get('MemberParty')
scrap.get('Party')
scrap.get('Person')
scrap.get('Transcript')

print("[INFO] Finish")
