#!/bin/bash


mkdir -p updates

function get_latest_update() {
  latest_file=$(ls -1v updates | tail -n 1)
  if [ -n "$latest_file" ]; then
    cat "updates/${latest_file}"
  else
    echo "-"
  fi
}

VACANT_DATES=$(./query-vacant-dates.sh)
CURRENT=""
for date in $VACANT_DATES
do
  if [[ "$date" > "2023-03-28" ]] && [[ "$date" < "2023-05-08" ]]; then
    CURRENT="${CURRENT}${date} "
  fi
done
echo $CURRENT
LATEST=$(get_latest_update)
if [[ "$CURRENT" != "$LATEST" ]]; then
  echo "DIFFERENT!"
  echo "$CURRENT" > updates/$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  kill -s USR2 $(cat node.pid)
else
  echo "THE SAME!"
fi
