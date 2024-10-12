FROM node:18-alpine
WORKDIR /app

RUN apk add --no-cache bash

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

ENV GRPC_HOST=0.0.0.0
ENV GRPC_PORT=8080

COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

EXPOSE 8080

CMD ["/usr/local/bin/wait-for-it.sh", "postgres:5432", "--", "node", "dist/index.js"]