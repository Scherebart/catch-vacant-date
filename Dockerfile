FROM alpine:latest

RUN apk add curl bash nodejs

RUN mkdir -p /home/app
WORKDIR /home/app

COPY . .

RUN mv crontab /etc/crontabs/root

RUN ./setup.sh

ENTRYPOINT [ "./start.sh" ]
