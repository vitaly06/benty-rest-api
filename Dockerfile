# Development stage
FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Устанавливаем Nest CLI глобально
RUN npm install -g @nestjs/cli

# Копируем файлы зависимостей
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install

# Копируем остальные файлы
COPY . .

ENV CUSTOMER_CODE=305194149
ENV JWT_TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiIxOGFmNDFhMGI0NjRkMzNkN2E2ZDNjNWRhOThjMTBkMSJ9.CyzpK0My-k7EquK3B0cLAb1vN0WpaxSd0bP0WV56kPZ7xIswlweQZLym7OuMeMWRbU3HC_H-yKtIn3gNlNQ97CD-A2oQ631nkQrVZEIldxPkxYEUKrAe2NMEYtGjspi_ISLkhta_cr9Es7tKvxJU2Ev1jrz5ikGU4oBSC6dVsU_dyDkvC1VrCrZzH73T1LRI9LNdYRcVU5fdjcCsr4T-2yF_FwvFQy0XONdIxUi9ulWWhXiIWNDA3iHSG3tu_-ll_1-N4LEMRm4INA5ofaG4MCi3o3SA-lZEqFPsbXZ7777rwcGc1AVCwvH4BOaYa2EVWTH2YdPQgBt9vBPdXClNncSfei1rP47I_tzMH_CaEWTM-6V16wJG74OxGKOcHcf_4Bf0WSwnc3Nbg5MUO6RD0QEkXcThF5igiqlLUiDcweb8Vzx5bH6Bysr_W1GNLX5z-80yrHcDPhRNYkBDuitLXcZhq5pFEgZHiHKgWhwCAHRgqRsZt-VonP2hzwpDRBLf"
ENV CLIENT_ID=18af41a0b464d33d7a6d3c5da98c10d1

# Генерируем Prisma Client
RUN npx prisma generate

# Собираем приложение
RUN yarn build

# Production stage
FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Копируем только необходимые файлы
COPY package.json yarn.lock ./
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/prisma ./prisma
COPY --from=development /usr/src/app/storage ./storage
COPY --from=development /usr/src/app/uploads ./uploads
COPY --from=development /usr/src/app/templates ./templates
# Устанавливаем только production зависимости
RUN yarn install --production

EXPOSE 3000

CMD ["yarn", "start:prod"]
