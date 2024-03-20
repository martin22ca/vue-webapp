# Use an official Apache runtime as a parent image
FROM httpd:latest

# Set the working directory in the container
WORKDIR /usr/local/apache2/htdocs/

# Copy the contents of the Vue.js app into the container
COPY dist/ .

# Make sure Apache listens on port 80
RUN sed -i 's/Listen 80/Listen 80/g' /usr/local/apache2/conf/httpd.conf
RUN cat /usr/local/apache2/conf/httpd.conf

# Expose port 80 to the outside world
EXPOSE 80

# Command to run the Apache server
CMD ["httpd", "-D", "FOREGROUND"]