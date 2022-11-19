#!/bin/bash
echo "module init"

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

. ~/.nvm/nvm.sh

nvm install 16.18.1

node -e "console.log('Running Node.js ' + process.version)"

npm install
