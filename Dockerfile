FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy application files
COPY server.js ./
COPY public/ ./public/
COPY data/ ./data/

# Expose default port
EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "server.js"]
