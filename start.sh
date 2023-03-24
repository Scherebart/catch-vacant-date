#!/bin/bash

set -m

node server/src/server.js &
PID=$!
sleep 2
echo $PID > temp/node.pid
fg %1
