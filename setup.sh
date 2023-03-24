#!/bin/bash

PROJECT_ROOT="$(dirname "$0")"

mkdir -p "${PROJECT_ROOT}/temp/updates"
mkdir -p "${PROJECT_ROOT}/state"

./node_modules/.bin/web-push generate-vapid-keys --json > "${PROJECT_ROOT}/state/vapid-keys.json"
