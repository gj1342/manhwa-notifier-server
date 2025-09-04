FROM node:20-slim

# System deps for Chromium (Puppeteer)
RUN apt-get update && apt-get install -y \
  ca-certificates fonts-liberation libasound2 libatk1.0-0 libatk-bridge2.0-0 \
  libc6 libatk1.0-data libcairo2 libcups2 libdbus-1-3 libexpat1 \
  libfontconfig1 libgbm1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 \
  libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcomposite1 \
  libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
  libxshmfence1 wget xdg-utils \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
    PUPPETEER_SKIP_DOWNLOAD=false \
    PUPPETEER_CACHE_DIR=/usr/local/share/.cache/puppeteer

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 8080 3000 5000

CMD ["node", "src/server.js"]


