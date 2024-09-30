FROM nginx:latest

# Remove default configuration
RUN rm /etc/nginx/conf.d/default.conf

# # Copy custom configuration
COPY conf.d/ /etc/nginx/conf.d/
