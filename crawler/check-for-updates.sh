#!/bin/bash

CRAWLER_ROOT="$(dirname "$0")"
TEMP_DIR="${CRAWLER_ROOT}/../temp"

mkdir -p "${TEMP_DIR}/updates"

function get_latest_update() {
  latest_file=$(ls -1v "${TEMP_DIR}/updates" | tail -n 1)
  if [ -n "$latest_file" ]; then
    cat "${TEMP_DIR}/updates/${latest_file}"
  else
    echo "-"
  fi
}

VACANT_DATES=$("${CRAWLER_ROOT}/query-vacant-dates.sh")
CURRENT=""
for date in $VACANT_DATES
do
  if [[ "$date" > "2023-03-28" ]] && [[ "$date" < "2023-07-08" ]]; then
    CURRENT="${CURRENT}${date}\n"
  fi
done
LATEST=$(get_latest_update)
if [[ "$(echo -e "${CURRENT}")" != "$(echo -e "${LATEST}")" ]]; then
  echo "DIFFERENT!"
  kill -s USR2 $(cat "${TEMP_DIR}/node.pid") && echo -e "$CURRENT" > "${TEMP_DIR}/updates/$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
else
  echo "THE SAME!"
fi
