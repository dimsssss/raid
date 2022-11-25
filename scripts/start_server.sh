#!/bin/bash


echo "Application Start"

pm2 stop all

pm2 start ~/app/bin/index
