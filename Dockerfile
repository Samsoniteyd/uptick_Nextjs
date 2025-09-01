
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM node:18-alpine

WORKDIR /app

COPY  package.json /app/
COPY  src/ .
COPY  . .

RUN npm install

EXPOSE 3000
CMD ["node", "server.js"]