FROM nginx:mainline-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/simp-frontend  /usr/share/nginx/html

# Copy the Entrypoint
COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
