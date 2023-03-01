FROM node:18

WORKDIR /app

COPY package.json .

RUN npm install --production

COPY ./dist .

CMD [ "node", "main.js" ]