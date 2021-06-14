FROM node:16.3-alpine3.11
WORKDIR /martes-backend
COPY package*.json ./
RUN npm install && npm install tsc -g
COPY . .
RUN npm run build
# TODO: find way to match port from .env with expose
EXPOSE 7000
CMD [ "npm", "run", "start" ]