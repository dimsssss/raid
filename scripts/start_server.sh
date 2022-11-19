#!/bin/bash


curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

. ~/.nvm/nvm.sh

nvm install 16.18.1

node -e "console.log('Running Node.js ' + process.version)"

cd ~/app

npm install

npm run stop

npm run production:start
