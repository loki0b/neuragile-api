FROM node:25.6.1

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY prisma ./prisma/

RUN npx prisma generate

COPY . /app

EXPOSE 8080

CMD [ "npm", "start" ]