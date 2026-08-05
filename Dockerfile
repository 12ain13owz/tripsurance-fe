# Use Node.js as base image
FROM node:24.19.0-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24.19.0-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runtime stage only ships the standalone output (next.config.ts sets
# `output: "standalone"`) — no node_modules/source copied in, smaller image.
FROM node:24.19.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 4000

CMD ["node", "server.js"]
