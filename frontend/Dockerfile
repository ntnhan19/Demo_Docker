# --- GIAI ĐOẠN 1: BUILD React App ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy toàn bộ kể cả node_modules từ máy host
COPY package.json package-lock.json ./
COPY node_modules ./node_modules
COPY . .

RUN npm run build

# --- GIAI ĐOẠN 2: SERVE với Nginx ---
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]