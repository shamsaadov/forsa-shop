# --- Stage 1: сборка фронта ---
FROM node:18-alpine AS builder-frontend
WORKDIR /app

# копируем манифест и конфиги для Vite
COPY package.json vite.config.ts tsconfig.json index.html ./
# Добавляем Tailwind и PostCSS конфиги
COPY tailwind.config.js postcss.config.js ./

# если у вас есть папка public с дополнительными статикой/иконками
COPY public ./public

# копируем исходники фронта и устанавливаем зависимости
COPY src/ ./src/
RUN npm install
RUN npm run build

# --- Stage 2: сборка и финальный образ сервера ---
FROM node:18-alpine AS builder-backend
WORKDIR /app

# копируем манифест сервера и код
COPY server/package.json server/tsconfig.json ./
COPY server/src/ ./src/

# ставим зависимости и собираем TS
RUN npm install
RUN npm run build

# переносим готовый билд фронта в папку public для отдачи статики
COPY --from=builder-frontend /app/dist ./public

# финальная конфигурация
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/index.js"]
