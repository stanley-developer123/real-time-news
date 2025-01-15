# 1) Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod
# The result is /app/dist/frontend/(browser?)

# 2) NGINX stage
FROM nginx:alpine
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
