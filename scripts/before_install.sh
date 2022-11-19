#!/bin/bash
echo "module init"

curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -

sudo yum install -y nodejs npm
sudo yum install npm  -y
sudo npm install pm2 -g

node -e "console.log('Running Node.js ' + process.version)"

