FROM node as build

WORKDIR /src
COPY package*.json .
RUN npm install
COPY . .
RUN npm run buid:api

FROM node:alpine as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /src
COPY package.json .
RUN npm install
COPY --from=build /src/dist/apps/api ./dist/apps/api
CMD npm run start:prod
