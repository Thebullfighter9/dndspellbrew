#!/bin/bash

cd /path/to/your/project
git pull origin master
npm install
pm2 restart all
