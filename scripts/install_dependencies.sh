#!/bin/bash
# update apt-get just in case
apt update
# install curl
apt install curl
# get node into apt
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
# install node and npm in one line
apt install -y nodejs
# install pm2 to restart node app
npm install pm2 -g
# latest pm2
pm2 update
