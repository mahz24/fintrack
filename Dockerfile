# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci

COPY . .

# Variables dummy solo para generar Prisma client
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ARG JWT_SECRET="dummy-secret-key-for-build-only-32chars"
ARG JWT_EXPIRES_IN="15m"
ARG PORT="3000"
ARG NODE_ENV="development"

ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET=$JWT_SECRET
ENV JWT_EXPIRES_IN=$JWT_EXPIRES_IN
ENV PORT=$PORT
ENV NODE_ENV=$NODE_ENV

RUN npx prisma generate
RUN npm run build

# Copiar generated a dist para que las rutas relativas funcionen
RUN cp -r src/generated dist/generated

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

RUN mkdir -p uploads

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]