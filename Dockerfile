FROM node:16 as build-stage

WORKDIR /usr/src/app

COPY package* /

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:alpine

ENV PORT 80

RUN npm install -g serve

COPY --from=build-stage /usr/src/app/public /usr/src/html

CMD serve -l $PORT /usr/src/html
