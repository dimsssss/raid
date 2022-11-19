#!/bin/bash

echo "start server"

npm install

pm2 kill
pm2 start ./bin/index
