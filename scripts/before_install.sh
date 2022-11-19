#!/bin/bash
echo "module init"

curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -

sudo yum install -y nodejs npm
sudo npm install pm2 -g

node -e "console.log('Running Node.js ' + process.version)"

