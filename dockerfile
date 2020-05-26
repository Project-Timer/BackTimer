FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/app/api/

COPY package-lock.json ./app/api/
COPY package.json ./app/api/

COPY . ./app/api/
EXPOSE 3000
