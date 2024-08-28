FROM grafana/grafana

ENV GF_SECURITY_ADMIN_PASSWORD=root

ENV GF_DATASOURCES_ALLOW_OVERWRITE=true
ENV GF_DATASOURCES_DEFAULT='{"apiVersion": 1, "datasources": [{"name": "Prometheus", "type": "prometheus", "url": "http://localhost:9090", "access": "proxy", "basicAuth": false}]}'

EXPOSE 3000

CMD ["/run.sh"]
