# PostgreSQL Deployment Guide (Local & VPS)

This guide covers how to set up a local PostgreSQL database using Docker for testing, and how to deploy your Next.js application alongside a PostgreSQL database on a VPS using Docker Compose.

---

## 1. Local Testing with Docker

To run a PostgreSQL database locally for testing and development, you can use a simple `docker-compose.yml` file. This prevents you from having to install PostgreSQL directly on your machine.

### Step 1: Create a `docker-compose.yml` (Local)
Create a file named `docker-compose.yml` at the root of your project:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: estqb_postgres_dev
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_local_password
      POSTGRES_DB: estqb_dev
    ports:
      - "5432:5432"
    volumes:
      - pgdata_dev:/var/lib/postgresql/data

volumes:
  pgdata_dev:
```

### Step 2: Start the Local Database
Run the following command in your terminal at the root of your project:
```bash
docker compose up -d
```
*(This starts the container in the background. You can stop it later with `docker compose down`)*

### Step 3: Update `.env`
Update your local `.env` file to point to this new Docker database:
```env
DATABASE_URL="postgresql://postgres:your_local_password@localhost:5432/estqb_dev?schema=public"
```

### Step 4: Push the Schema
Now that your database is running, tell Prisma to push your schema models to it:
```bash
npx prisma db push
```

---

## 2. Deploying on a VPS

Deploying to a VPS (like DigitalOcean, Linode, or Hetzner) involves running both your Next.js application and your PostgreSQL database securely.

### Prerequisites on the VPS
1. SSH into your VPS.
2. Install **Docker** and **Docker Compose**.
3. Point your domain name (e.g., `estqb.et`) to your VPS's IP address.

### Step 1: Create a Production `docker-compose.yml`
On your VPS, create a folder for your project and add a `docker-compose.yml` file. This file will build your Next.js app, start PostgreSQL, and use Redis for caching.

```yaml
version: '3.8'

services:
  web:
    build: .
    container_name: estqb_web
    restart: always
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://estqb_admin:YOUR_SECURE_PASSWORD@postgres:5432/estqb_prod?schema=public
      - NEXTAUTH_SECRET=YOUR_SECURE_NEXTAUTH_SECRET
      - NEXTAUTH_URL=https://yourdomain.com
      # Add other production env vars here (AWS, Resend, etc.)
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    container_name: estqb_postgres_prod
    restart: always
    environment:
      POSTGRES_USER: estqb_admin
      POSTGRES_PASSWORD: YOUR_SECURE_PASSWORD
      POSTGRES_DB: estqb_prod
    volumes:
      - pgdata_prod:/var/lib/postgresql/data
    # We do NOT expose port 5432 to the host for security. 
    # Only the 'web' container can access it internally.

  redis:
    image: redis:7-alpine
    container_name: estqb_redis_prod
    restart: always
    volumes:
      - redisdata_prod:/data

volumes:
  pgdata_prod:
  redisdata_prod:
```

### Step 2: Create a `Dockerfile` for Next.js
At the root of your project, ensure you have a `Dockerfile` to build your Next.js app for production. 

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate prisma client before building
RUN npx prisma generate
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy Prisma schema and generated client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

> **Note:** To use standalone output, make sure you add `output: 'standalone'` to your `next.config.ts`.

### Step 3: Deployment & Migrations
1. Clone your repository onto the VPS.
2. Run the deployment:
   ```bash
   docker compose up -d --build
   ```
3. Run the initial database migration. Because your database is isolated, run the Prisma migration command *inside* the web container:
   ```bash
   docker exec -it estqb_web npx prisma migrate deploy
   ```

### Step 4: Reverse Proxy & SSL (Nginx / Traefik / Caddy)
You will need a reverse proxy to route port 80/443 (HTTP/HTTPS) to port 3000 of your Next.js container. 
**Caddy** is highly recommended as it automatically provisions Let's Encrypt SSL certificates.

Example `Caddyfile`:
```
yourdomain.com {
    reverse_proxy localhost:3000
}
```
