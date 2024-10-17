FROM elasticsearch:7.17.0

COPY elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml

COPY init-elasticsearch.sh /usr/local/bin/init-elasticsearch.sh

COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh

ENV ELASTIC_PASSWORD=root

RUN chmod +x /usr/local/bin/init-elasticsearch.sh /usr/local/bin/wait-for-it.sh

USER elasticsearch

EXPOSE 9200

CMD ["/bin/bash", "-c", "elasticsearch" , "/usr/local/bin/wait-for-it.sh http://elasticsearch:9200 --", "/usr/local/bin/init-elasticsearch.sh"]
