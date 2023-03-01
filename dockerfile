FROM node:18.1.0-alpine3.13

WORKDIR /app

COPY package.json .

RUN npm install --production

COPY ./dist .

CMD [ "node", "main.js" ]