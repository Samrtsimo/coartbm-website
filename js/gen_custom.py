#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Scan choose/ folders for user-selected About & Hero images, write data/custom.js.
Run:  python js/gen_custom.py
Windows PowerShell:  python js/gen_custom.py
"""
import os, json, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # site/
choose = os.path.join(ROOT, 'assets', 'images', 'choose')

def imgs(folder):
    path = os.path.join(choose, folder)
    if not os.path.isdir(path):
        return []
    exts = ('.jpg', '.jpeg', '.png', '.webp')
    files = sorted([f for f in os.listdir(path) if f.lower().endswith(exts)])
    return ['assets/images/choose/' + folder + '/' + f for f in files]

hero = imgs('hero')
about = imgs('about')

data = {}
if hero:
    data['HERO_IMAGES'] = hero
if about:
    data['ABOUT_IMAGES'] = about

out = os.path.join(ROOT, 'data', 'custom.js')
with open(out, 'w', encoding='utf-8') as f:
    f.write('// auto-generated from assets/images/choose/ — do not edit by hand\n')
    for k, v in data.items():
        f.write('window.%s = %s;\n' % (k, json.dumps(v, ensure_ascii=False)))
    if not data:
        f.write('// (no user images yet — Hero/About fall back to defaults)\n')

print('custom.js written:', out)
print('  HERO_IMAGES:', len(hero), hero)
print('  ABOUT_IMAGES:', len(about), about)
