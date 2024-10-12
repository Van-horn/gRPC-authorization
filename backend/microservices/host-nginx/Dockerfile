FROM nginx:1.23-alpine

RUN apk add --no-cache openssl

COPY https/cert.crt /etc/nginx/ssl/cert.crt
COPY https/key.key /etc/nginx/ssl/key.key

COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]