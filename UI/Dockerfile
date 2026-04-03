FROM nginx:alpine

# Copy HTML, CSS, and JS files
COPY html /usr/share/nginx/html
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY api /usr/share/nginx/html/api

# Expose port 80 for the UI
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
