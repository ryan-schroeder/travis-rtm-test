FROM node:4
ENV COMPOSE_VERSION 1.7.0
RUN mkdir -p /tmp
COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app/

WORKDIR /usr/src/app
COPY . /usr/src/app

CMD [ "npm", "start" ]
