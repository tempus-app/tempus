FROM node as build
WORKDIR /src
COPY . .
RUN npm install
RUN npm run build:api

FROM node:16.8.0-alpine as production
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /src
COPY package*.json ./
COPY decorate-angular-cli.js ./
RUN npm install --only=prod
COPY --from=build /src/dist/apps/api ./dist/apps/api
CMD npm run start:api:prod
