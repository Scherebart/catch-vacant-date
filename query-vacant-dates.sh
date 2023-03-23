#!/bin/bash

attempts=0
while (( attempts < 2 )); do
  http_res=$(curl --no-progress-meter --request "GET" --cookie cookies "https://dobryoptometrysta.nakiedy.pl/results.html?staff=4180")
  res=$(echo "$http_res" | ./pup 'th attr{data-date}')
  if [[ -n "$res" ]]; then
    break;
  fi

  curl --cookie-jar cookies --data "service=9546" "https://dobryoptometrysta.nakiedy.pl/"
  (( attempts++ ))
done

echo "$res"

