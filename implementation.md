# Implementation Guide: ESTQB Ethiopia Platform

This document explains how each core function in the platform is set up and how you can manage or extend them.

## 1. UI & Styling (Tailwind CSS + shadcn/ui)
The platform uses **Tailwind CSS v4** combined with **shadcn/ui** for accessible, customizable components.
- **Adding new components:** Use the shadcn CLI. Run `npx shadcn@latest add [component-name]` (e.g., `npx shadcn@latest add card`).
- **Aesthetics & Theme:** We use a modern, premium design system. Colors, typography (Inter), and radius are defined in `src/app/globals.css`.
- **RTL Support:** Tailwind's logical properties (like `ms-4` instead of `ml-4`) are used to ensure the UI automatically flips for Arabic (`ar`) users.

## 2. Authentication & Roles (Auth.js v5)
We use **Auth.js (next-auth@beta)** for secure, session-based authentication.
- **Config Location:** `src/auth.ts`.
- **API Route:** `src/app/api/auth/[...nextauth]/route.ts`.
- **Middleware:** `src/middleware.ts` intercepts requests. It redirects unauthenticated users away from `/student` and `/admin`, and strictly blocks non-admins from `/admin/superadmin`.
- **Adding Providers:** Currently set up with `Credentials` (email/password). You can add Google or GitHub providers directly in `src/auth.ts`.

## 3. Database & ORM (Prisma & PostgreSQL)
The database schema is managed via **Prisma**.
- **Schema Location:** `prisma/schema.prisma`.
- **Setup:** You need a PostgreSQL database (e.g., local Postgres, Neon, or Supabase).
- **Environment Variable:** Add your connection string to a `.env` file at the root: `DATABASE_URL="postgresql://user:pass@host:5432/estqb"`
- **Applying Changes:** 
  1. Modify `schema.prisma`.
  2. Run `npx prisma db push` (for prototyping) or `npx prisma migrate dev` (for production).
  3. Run `npx prisma generate` to update the TypeScript client.

## 4. Internationalization (next-intl)
The app supports English (`en`), Amharic (`am`), and Arabic (`ar`).
- **Translation Files:** Located in the `messages/` folder (`en.json`, `am.json`, `ar.json`).
- **Adding new strings:** Add the key-value pair to all JSON files. Use it in a component via `const t = useTranslations('Namespace'); t('key')`. Note: In async Server Components, use `getTranslations()`.
- **Routing:** All routes are prefixed with the locale (e.g., `/en/about`). This is handled automatically by the `next-intl` middleware composed in `src/middleware.ts`.

## 5. Caching (Redis/Upstash) *[To Be Implemented]*
To make the certification catalog and translations lightning fast:
- We will integrate `@upstash/redis`.
- Create a `src/lib/redis.ts` file to initialize the client using `UPSTASH_REDIS_REST_URL`.
- Wrap database calls for the public catalog with Redis `get` and `setex`.

## 6. Certificate PDF Generation *[To Be Implemented]*
When a candidate completes a certification:
- We will use `@react-pdf/renderer` or `puppeteer` to generate the certificate on a background route.
- The PDF will be uploaded to an S3-compatible bucket, and the public URL will be stored in the `Certificate` database model.

## 7. File Storage (AWS S3 / Cloudflare R2) *[To Be Implemented]*
For syllabus PDFs and profile images:
- We will use the AWS SDK (`@aws-sdk/client-s3`).
- API routes will generate signed upload URLs to allow direct-to-S3 uploads, preventing our servers from being a bottleneck for large files.

## 8. Search (Meilisearch) *[To Be Implemented]*
For the Blog CMS:
- A Meilisearch instance will index all `BlogPost` entries.
- Search queries on `/blog` will hit Meilisearch directly for typo-tolerant, instant results.
