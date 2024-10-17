FROM node:18-alpine

RUN apk add --no-cache bash

WORKDIR /app

COPY package*.json ./

COPY webpack.config.js ./
COPY tsconfig.json ./

COPY ./src ./src

RUN npm ci

RUN npm run build

RUN rm -rf /app/src \
    && rm /app/webpack.config.js \
    && rm /app/tsconfig.json

RUN npm prune --production

ENV GRPC_HOST=0.0.0.0
ENV GRPC_PORT=8080

COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

EXPOSE 8080

CMD [ "node", "dist/index.js"]
# CMD ["/usr/local/bin/wait-for-it.sh", "elasticsearch:9200", "--", "node", "dist/index.js"]