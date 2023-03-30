FROM node:19-slim

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PASSWORD=admin123

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]