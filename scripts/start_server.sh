#!/bin/bash

echo "module init"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

. ~/.nvm/nvm.sh

nvm install --lts
npm install


echo "server start"
pm2 kill
pm2 start ./bin/index
