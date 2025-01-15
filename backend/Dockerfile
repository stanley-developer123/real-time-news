FROM node:18-alpine

WORKDIR /app
COPY . /app

RUN npm install

# build NestJS
RUN npm run build

EXPOSE 3000
CMD ["sh", "-c", "sleep 5 && node dist/main"]
