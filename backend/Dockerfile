FROM node:20-alpine

WORKDIR /app

# Production runtime defaults (override via compose / platform env)
ENV NODE_ENV=production
ENV PORT=8096
ENV HOST=0.0.0.0

# Copy package manifests first for better layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev || npm install --omit=dev

# Copy the rest of the backend package (build context = ./backend only)
COPY . .

# Ensure uploads directory exists at runtime
RUN mkdir -p uploads

EXPOSE 8096

# Healthcheck uses /health (no DB required) so the container can report ready
HEALTHCHECK --interval=20s --timeout=5s --retries=5 --start-period=40s \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8096)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
