# ─── Stage 1: builder ─────────────────────────────────────────────────────────
FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# ─── Stage 2: runner ──────────────────────────────────────────────────────────
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 worker

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY --from=builder --chown=worker:nodejs /app/dist ./dist

USER worker
CMD ["node", "dist/index.js"]