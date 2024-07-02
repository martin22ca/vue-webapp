# Use an official Node.js image as a parent image
FROM node:latest as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json to install dependencies
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Vue.js app
RUN npm run build

# Stage 2: Use an official Apache runtime as a parent image
FROM httpd:latest

# Set the working directory in the container
WORKDIR /usr/local/apache2/htdocs/

# Copy the built files from the previous stage
COPY --from=build /app/dist/ .

# Copy the .htaccess file
COPY .htaccess /usr/local/apache2/htdocs/

# Enable necessary Apache modules and configure Apache
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i '/LoadModule proxy_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i '/LoadModule proxy_http_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's/AllowOverride None/AllowOverride All/g' /usr/local/apache2/conf/httpd.conf

# Copy custom Apache configuration
COPY apache.conf /usr/local/apache2/conf/apache.conf

# Include custom configuration in Apache's main configuration file
RUN echo "Include /usr/local/apache2/conf/apache.conf" >> /usr/local/apache2/conf/httpd.conf

# Expose port 80 to the outside world
EXPOSE 80

# Command to run the Apache server
CMD ["httpd", "-D", "FOREGROUND"]