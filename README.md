# catch-optometrist-vacant-date
Small script to repetitively poll an appointement web service for free terms on given doctor specialization

Command to build the docker image:
```
docker build -t scherebart/check-optometrist-vacant-date . 
```

To run the image
```
docker volume create optometrist-state 
docker volume create optometrist-temp

docker run -p 80:8080 -it --name optometrist -v optometrist-temp:/home/app/temp -v optometrist-state:/home/app/state docker.io/scherebart/check-optometrist-vacant-date
```

To run an updated image
```
docker container rm optometrist
docker run -p 80:8080 -it --name optometrist -v optometrist-temp:/home/app/temp -v optometrist-state:/home/app/state docker.io/scherebart/check-optometrist-vacant-date
```
