# ----------------------------------------
# 1. Build stage
# ----------------------------------------
FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ----------------------------------------
# 2. Production runtime
# ----------------------------------------
FROM node:20 AS runner
WORKDIR /app

# Install a lightweight static server
RUN npm install -g serve

# Copy only the build folder
COPY --from=builder /app/dist ./dist

EXPOSE 8080

# Serve the Vite build
CMD ["serve", "-s", "dist", "-l", "8080"]
