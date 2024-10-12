FROM kibana:7.5.2

# Переключаемся на пользователя root
USER root

# Копирование конфигурационного файла Kibana
COPY kibana.yml /usr/share/kibana/config/kibana.yml

# Копирование скрипта wait-for-it.sh
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh

# Делаем wait-for-it.sh исполняемым
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Возвращаемся к пользователю kibana
USER kibana

# Открытие порта
EXPOSE 5601

# Команда запуска
CMD ["/usr/local/bin/wait-for-it.sh", "elasticsearch:9200", "--", "kibana"]