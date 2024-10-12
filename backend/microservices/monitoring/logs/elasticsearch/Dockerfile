FROM elasticsearch:7.17.0

# Копирование конфигурационного файла elasticsearch.yml в контейнер
COPY elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml

# Копирование инициализационного скрипта
COPY init-elasticsearch.sh /usr/local/bin/init-elasticsearch.sh

# Установка переменных окружения (если нужно)
ENV ELASTIC_PASSWORD="root"

# Делаем скрипт исполняемым
RUN chmod +x /usr/local/bin/init-elasticsearch.sh

USER elasticsearch


# Открытие порта
EXPOSE 9200

# Команда запуска
CMD ["/bin/bash", "-c", "elasticsearch & while ! curl -s http://elasticsearch:9200; do echo 'Waiting for Elasticsearch...'; sleep 7; done; /usr/local/bin/init-elasticsearch.sh; tail -f /dev/null"]