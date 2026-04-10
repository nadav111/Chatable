FROM nginx:alpine

# Copy static files to nginx html directory
COPY html/ /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY api/ /usr/share/nginx/html/api/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]