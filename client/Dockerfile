# ----------------------------------------
# 1. Build stage
# ----------------------------------------
FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy everything (including .env.production)
COPY . .

# Build in production mode
RUN npm run build -- --mode production

# ----------------------------------------
# 2. Runtime (serving static files)
# ----------------------------------------
FROM node:20 AS runner
WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
