FROM node:24.14.0-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN cp -r .next/static .next/standalone/.next/static

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

WORKDIR /app/.next/standalone
CMD ["node", "server.js"]