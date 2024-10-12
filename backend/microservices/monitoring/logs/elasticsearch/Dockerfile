FROM elasticsearch:7.17.0

# Копирование конфигурационного файла elasticsearch.yml в контейнер
COPY elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml

# Копирование инициализационного скрипта
COPY init-elasticsearch.sh /usr/local/bin/init-elasticsearch.sh

COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh


# Установка переменных окружения (если нужно)
ENV ELASTIC_PASSWORD="root"

# Делаем скрипт исполняемым
RUN chmod +x /usr/local/bin/init-elasticsearch.sh /usr/local/bin/wait-for-it.sh

USER elasticsearch


# Открытие порта
EXPOSE 9200

# Команда запуска
CMD ["/bin/bash", "-c", "elasticsearch" , "/usr/local/bin/wait-for-it.sh elasticsearch:9200 --", "/usr/local/bin/init-elasticsearch.sh"]
# http://elasticsearch:9200