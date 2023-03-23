#!/bin/bash

set -m

node server.js &
PID=$!
sleep 2
echo $PID > node.pid
fg %1
