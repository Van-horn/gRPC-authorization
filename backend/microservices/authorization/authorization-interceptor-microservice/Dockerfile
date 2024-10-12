FROM node:18-alpine
WORKDIR /app

COPY package*.json ./

COPY webpack.config.js ./
COPY tsconfig.json ./
COPY ./src ./src

RUN npm ci
RUN npm run build

RUN rm -rf /app/src
RUN rm /app/webpack.config.js
RUN rm /app/tsconfig.json

RUN npm prune --production


EXPOSE 8080

CMD ["node", "dist/index.js"]