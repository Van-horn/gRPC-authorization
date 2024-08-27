FROM elasticsearch:8.15.0

ENV cluster.name="elasticsearch-cluster"
ENV node.name="master"
ENV path.data="/usr/share/elasticsearch/data"
ENV path.logs="/usr/share/elasticsearch/logs"
ENV network.host="0.0.0.0"
ENV http.port="9200"
ENV discovery.type="single-node"
ENV xpack.security.enabled="false"

EXPOSE 9200

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

CMD ["elasticsearch"]