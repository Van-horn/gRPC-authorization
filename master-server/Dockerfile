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

ENV GRPC_HOST=0.0.0.0
ENV GRPC_PORT=8080

EXPOSE 8080

CMD ["node", "dist/index.js"]