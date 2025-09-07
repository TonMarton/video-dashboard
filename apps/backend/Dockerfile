FROM node:24-alpine AS builder

WORKDIR /app

COPY packages/shared-types ./packages/shared-types
RUN cd packages/shared-types && npm install && npm run build

COPY apps/backend/package*.json ./
COPY apps/backend/tsconfig.json ./

RUN npm install

RUN mkdir -p node_modules/@video-dashboard && \
    ln -sf ../../packages/shared-types node_modules/@video-dashboard/shared-types

COPY apps/backend/src ./src
COPY apps/backend/prisma ./prisma
COPY apps/backend/videos.json ./

RUN npm run build
RUN npx prisma generate

FROM node:24-alpine AS production

WORKDIR /app

COPY packages/shared-types ./packages/shared-types
RUN cd packages/shared-types && npm install && npm run build

COPY apps/backend/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

COPY apps/backend/prisma ./prisma
COPY apps/backend/videos.json ./

RUN mkdir -p node_modules/@video-dashboard && \
    ln -sf ../../packages/shared-types node_modules/@video-dashboard/shared-types

RUN npx prisma generate

EXPOSE 8000

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && npm run seed && npm start"]
