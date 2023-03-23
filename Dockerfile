FROM alpine:latest

RUN apk add curl bash nodejs

RUN mkdir -p /home/app
WORKDIR /home/app

COPY login.sh query-vacant-dates.sh pup ./
COPY server.js .
