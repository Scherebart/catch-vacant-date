#!/bin/bash

CRAWLER_ROOT="$(dirname "$0")"

attempts=0
while (( attempts < 2 )); do
  http_res=$(curl --no-progress-meter --request "GET" --cookie "${CRAWLER_ROOT}/../temp/cookies" "https://dobryoptometrysta.nakiedy.pl/results.html?staff=4180")
  res=$(echo "$http_res" | "${CRAWLER_ROOT}/pup" 'th attr{data-date}')
  if [[ -n "$res" ]]; then
    break;
  fi

  curl --no-progress-meter --cookie-jar "${CRAWLER_ROOT}/../temp/cookies" --data "service=9546" "https://dobryoptometrysta.nakiedy.pl/"
  (( attempts++ ))
done

echo "$res"

