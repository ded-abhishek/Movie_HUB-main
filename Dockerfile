FROM node:alpine

WORKDIR /movies

COPY . /movies

RUN npm install

CMD [ "npm","start" ]