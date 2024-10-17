FROM kibana:7.5.2

USER root

COPY kibana.yml /usr/share/kibana/config/kibana.yml

COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh

RUN chmod +x /usr/local/bin/wait-for-it.sh

USER kibana

EXPOSE 5601

CMD ["/usr/local/bin/wait-for-it.sh", "http://elasticsearch:9200", "--", "kibana"]