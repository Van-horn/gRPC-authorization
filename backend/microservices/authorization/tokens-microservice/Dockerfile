FROM node:18-alpine

# Установка Bash
RUN apk add --no-cache bash

# Установка рабочей директории
WORKDIR /app

# Копирование файлов зависимостей
COPY package*.json ./

# Копирование конфигурационных файлов
COPY webpack.config.js ./
COPY tsconfig.json ./

# Копирование исходного кода
COPY ./src ./src

# Установка зависимостей
RUN npm ci

# Сборка приложения
RUN npm run build

# Удаление ненужных файлов
RUN rm -rf /app/src \
    && rm /app/webpack.config.js \
    && rm /app/tsconfig.json

# Удаление неиспользуемых зависимостей
RUN npm prune --production

# Установка переменных окружения
ENV GRPC_HOST=0.0.0.0
ENV GRPC_PORT=8080

# Копирование скрипта wait-for-it.sh и установка прав
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Открытие порта
EXPOSE 8080

# Команда запуска
CMD ["/usr/local/bin/wait-for-it.sh", "elasticsearch:9200", "--", "node", "dist/index.js"]