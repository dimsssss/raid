#!/bin/bash
echo "module init"

curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -

sudo yum install -y nodejs npm

node -e "console.log('Running Node.js ' + process.version)"

cd ~/app

npm install