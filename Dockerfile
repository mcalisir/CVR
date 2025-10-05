# Nginx ile static site serve et
FROM nginx:alpine

# Static dosyaları kopyala
COPY index.html index-en.html script.js script-en.js styles.css /usr/share/nginx/html/

# Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port 80'de çalıştır
EXPOSE 80

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]
