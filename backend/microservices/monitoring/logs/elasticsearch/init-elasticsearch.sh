curl -X PUT "/index" -H 'Content-Type: application/json'  -d '{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "content": { "type": "text" },
      "timestamp": { "type": "date" }
    }
  }
}'