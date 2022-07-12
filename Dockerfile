# docker run -it -d --name weather_telegram --hostname weather_telegram weather_telegram /bin/bash
FROM node:12.22.12-buster-slim

MAINTAINER Vuong<ducvuongpham2004@gmail.com>

RUN DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get -y upgrade

WORKDIR /root/

COPY src /root/src/

COPY .env /root/

COPY package.json /root/

COPY package-lock.json /root/

RUN npm install

ENTRYPOINT npm start