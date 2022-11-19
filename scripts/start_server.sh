#!/bin/bash

nvm use 16.18.1

cd ~/app

npm run stop

npm run production:start
