# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci

COPY . .

# Variables dummy solo para generar Prisma client
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV JWT_SECRET="dummy-secret-key-for-build-only-32chars"
ENV JWT_EXPIRES_IN="15m"
ENV PORT="3000"
ENV NODE_ENV="development"

RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated

RUN mkdir -p uploads

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]