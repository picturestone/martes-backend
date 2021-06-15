FROM node:16.3-alpine3.11
WORKDIR /martes-backend
COPY package*.json ./
RUN npm install && npm install tsc -g
COPY .env.docker .env
COPY . .
RUN npm run build
EXPOSE 7000
CMD [ "npm", "run", "start" ]
