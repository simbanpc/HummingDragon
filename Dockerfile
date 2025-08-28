# syntax=docker/dockerfile:1

############################
# 1) Install deps
############################
FROM node:20-alpine AS deps
WORKDIR /app
# Use corepack for pnpm (bundled with Node 20)
RUN corepack enable
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

############################
# 2) Build
############################
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Produces .next/standalone for small runtime image
RUN pnpm run build

############################
# 3) Run
############################
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1

# Optional non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy the minimal runtime output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
