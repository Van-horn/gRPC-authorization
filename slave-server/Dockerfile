FROM node:18-alpine
WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY dist/ ./dist/

ENV GRPC_HOST=0.0.0.0
ENV GRPC_PORT=8080

EXPOSE 8080

CMD ["node", "dist/index.js"]