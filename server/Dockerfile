FROM node:20-alpine

WORKDIR /app

# Install dependencies first for layer caching.
# npm install is used instead of npm ci because no package-lock.json
# is committed to the repository (generated package.json only).
COPY package.json ./
RUN npm install --omit=dev

# Copy source
COPY src/ ./src/

EXPOSE 3000

CMD ["node", "src/index.js"]
