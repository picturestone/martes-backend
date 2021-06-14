FROM node:16
WORKDIR /martes-backend
COPY package*.json ./
RUN npm install && npm install tsc -g
COPY . .
COPY .env.example .env
RUN npm run build
EXPOSE 7000
CMD [ "npm", "run", "start" ]