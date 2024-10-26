FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json .
COPY src ./src
COPY public ./public

RUN npm ci
RUN npm run build

RUN rm -rf /app/src
RUN rm -rf /app/public
RUN rm /app/tsconfig.json
RUN npm prune --production

RUN npm install -g serve

COPY ./build ./build

EXPOSE 3000

CMD ["serve", "-s", "build"]