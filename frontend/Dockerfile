FROM nginx:alpine

# מחיקת הגדרת ברירת המחדל
RUN rm /etc/nginx/conf.d/default.conf

# יצירת הגדרה חדשה ופשוטה שמצביעה לתיקייה שלך
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
    } \
}' > /etc/nginx/conf.d/my_site.conf

# העתקת הקבצים שלך (לפי המבנה שלך)
COPY html /usr/share/nginx/html
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY api /usr/share/nginx/html/api

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]