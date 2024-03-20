# Use an official Node.js image as a parent image
FROM node:latest as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock/npm.lock to install dependencies
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Build the Vue.js app
RUN yarn build

# Stage 2: Use an official Apache runtime as a parent image
FROM httpd:latest

# Set the working directory in the container
WORKDIR /usr/local/apache2/htdocs/

# Copy the built files from the previous stage
COPY --from=build /app/dist/ .

# Make sure Apache listens on port 80
RUN sed -i 's/Listen 80/Listen 80/g' /usr/local/apache2/conf/httpd.conf
RUN cat /usr/local/apache2/conf/httpd.conf

# Expose port 80 to the outside world
EXPOSE 80

# Command to run the Apache server
CMD ["httpd", "-D", "FOREGROUND"]