FROM nginx:alpine

# Copy custom nginx configuration and static files
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY html/ /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY api/ /usr/share/nginx/html/api/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]