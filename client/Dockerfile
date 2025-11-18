# ----------------------------------------
# 1. Build stage
# ----------------------------------------
FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy everything (including .env.staging)
COPY . .

# Build with STAGING mode
RUN npm run build -- --mode staging

# ----------------------------------------
# 2. Production runtime
# ----------------------------------------
FROM node:20 AS runner
WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]
