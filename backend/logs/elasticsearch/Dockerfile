FROM elasticsearch:8.15.0

ENV ELASTICSEARCH_CLUSTER_NAME="elasticsearch-cluster"
ENV ELASTICSEARCH_NODE_NAME="master"
ENV ELASTICSEARCH_PATH_DATA="/usr/share/elasticsearch/data"
ENV ELASTICSEARCH_PATH_LOGS="/usr/share/elasticsearch/logs"
ENV ELASTICSEARCH_NETWORK_HOST="0.0.0.0"
ENV ELASTICSEARCH_HTTP_PORT="9200"
ENV ELASTICSEARCH_DISCOVERY_TYPE="single-node"
ENV discovery.type=single-node
ENV xpack.security.enabled=false

EXPOSE 9200

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

CMD ["elasticsearch"]