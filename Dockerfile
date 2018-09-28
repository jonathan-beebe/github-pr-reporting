FROM node:8

RUN npm i -g yarn 
RUN mkdir /app
ADD ./package.json /app
ADD ./yarn.lock /app
WORKDIR /app
RUN yarn
ADD . /app