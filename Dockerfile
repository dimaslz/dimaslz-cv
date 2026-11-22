# syntax=docker/dockerfile:1
FROM node:24.22.3-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.24.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# production dependencies only (puppeteer is the only runtime dependency)
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
	pnpm install --prod --frozen-lockfile --ignore-scripts

# all dependencies + build
FROM base AS builder
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
	pnpm install --frozen-lockfile

COPY . .

# the env schema validates API_DIMASLZ_URL at build time too
ARG API_DIMASLZ_URL
ENV API_DIMASLZ_URL=$API_DIMASLZ_URL

RUN NODE_ENV=production pnpm build

# runtime image: no dev dependencies, no sources
FROM node:24.22.3-alpine AS runner

# chromium is needed by puppeteer to generate the PDFs
RUN apk add -q --no-cache \
	chromium \
	nss \
	freetype \
	harfbuzz \
	ca-certificates \
	ttf-freefont

ENV NODE_ENV=production
ENV PORT=3000
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY package.json ./

USER node

EXPOSE 3000

CMD ["node", "build"]
