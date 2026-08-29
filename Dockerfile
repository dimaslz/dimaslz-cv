FROM node:22.21-alpine AS builder

WORKDIR /app

# update packages
RUN apk update
RUN apk add -q --update --no-cache \
	chromium \
	nss \
	freetype \
	freetype-dev \
	harfbuzz \
	ca-certificates \
	ttf-freefont

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN corepack enable && corepack prepare pnpm@11.24.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN pnpm install --frozen-lockfile

COPY . .

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN NODE_ENV=production pnpm build

EXPOSE 3000

ENV PORT=3000

CMD ["pnpm", "start"]
