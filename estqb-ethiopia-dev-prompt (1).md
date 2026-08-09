# Development Prompt: ESTQB Ethiopia Certification Platform

## Project Overview
Build a full-stack, production-grade web application for **ESTQB Ethiopia**, a certification body offering software testing certifications (Foundation Level, Advanced Test Analyst, Agile Testing, etc.). The platform serves three user types — candidates, instructors, and admins — and combines a marketing site, a course/certification management system, a blog/CMS, and true multilingual support across 15 languages.

**Deployment target: a single self-hosted VPS, fully Dockerized, with no paid third-party infrastructure except transactional email.**

---

## Tech Stack (self-hosted, Docker Compose)

| Layer | Choice | Why |
|---|---|---|
| Frontend/Framework | **Next.js 14+ (App Router), TypeScript** | Server components + ISR for fast public pages, runs fine in a Node container |
| Styling/UI | **Tailwind CSS + shadcn/ui** | Fast to build, accessible primitives, easy RTL theming for Arabic |
| Database | **PostgreSQL** (Docker container) | Free, no size limits, relational integrity for enrollments/certificates |
| ORM | **Prisma** | Type-safe queries, easy migrations |
| Auth | **Auth.js (NextAuth) or Lucia** | Battle-tested session/JWT handling, RBAC middleware |
| Cache | **Redis** (Docker container) | Free, no request caps when self-hosted — caches catalog, blog list, resolved translations |
| File storage | **MinIO** (Docker container) | S3-compatible API — same code as AWS S3/R2, just points at your own bucket |
| Search | **Meilisearch** (Docker container) | Fast, typo-tolerant search across blog/certifications, per-locale indexes |
| Reverse proxy + SSL | **Caddy** | Automatic free HTTPS (Let's Encrypt), simple config |
| Email (only external dependency) | **Resend or Brevo (free tier)** | Self-hosted SMTP has near-guaranteed deliverability problems; not worth the risk for password resets and certificate notices |
| Orchestration | **Docker Compose** | One `docker-compose.yml` runs the whole stack on one VPS |

**Minimum VPS**: 2 vCPU / 4GB RAM for MVP traffic. Provider recommendation: Hetzner (best price/performance) or DigitalOcean/Linode as alternatives.

**Backups**: automate nightly Postgres dumps and MinIO bucket sync to a second location (a cheap secondary VPS or free-tier object storage elsewhere) — this is the single most important thing to set up before going live, since there's no managed-service safety net.

---

## 1. User Roles & Authentication

Three roles: **candidate**, **instructor**, **admin**.

- Auth.js/Lucia session or JWT handling rather than hand-rolled crypto.
- Role-based middleware protecting both pages and API routes (never rely on client-side hiding).
- Profile management: name, email, phone, profile photo, password change.
- Separate `/admin/login` entry point with stricter rate limiting and login-attempt audit logging.
- Forgot-password flow via email (Resend/Brevo).
- Consider optional MFA for admin accounts given the certificate-issuance authority they hold.

```
User {
  id, fullName, email, passwordHash, role [candidate|instructor|admin],
  phone, profileImageUrl, isVerified, mfaEnabled, createdAt, updatedAt
}
```

---

## 2. Course & Certification Management

- Public catalog: certifications with descriptions, price, exam dates, syllabus links.
- Candidates browse and enroll.
- Enrollment status: `active`, `in-progress`, `completed`; track `progressPercent`.
- **Certificate issuance is manual**: after grading, an admin/instructor uploads the certificate file (PDF or image) for a candidate directly through the admin dashboard. No PDF generation, no rendering pipeline — just a file upload to MinIO plus a DB record.
- **Public certificate verification page**: lookup by certificate number, no login required, serves the uploaded file.
- Cache the certification catalog in Redis (invalidate on admin edit) since it's read far more than it's written.

```
Certification {
  id, title, level, description, price, examDate, durationWeeks,
  syllabusFileId, passRate, createdAt, updatedAt
}

Enrollment {
  id, userId, certificationId, status [active|in-progress|completed],
  progressPercent, enrolledAt, completedAt
}

Certificate {
  id, certificateId, certificateNumber, userId, certificationId,
  grade, fileUrl, issuedBy, issuedAt
}
```

**Admin certificate upload flow**: select candidate + certification → enter grade → upload file (PDF/image, validated file type + size) → system generates a unique `certificateId`/`certificateNumber` → record saved and immediately visible on `/student/certificates` and via `/verify-certificate`.

---

## 3. Content Management System (Blog)

- Instructors/admins create, edit, delete, publish posts.
- Fields: title, body (structured rich text editor — e.g., Tiptap, not raw HTML), category (`Tips`, `Announcements`, `Events`, `News`), tags, featured flag, cover image, author.
- Auto-calculate read time from word count.
- Public blog with search (Meilisearch, per-locale index) and category filters.
- Use ISR (revalidate on publish) for blog pages — faster than SSR for a mostly-static newsroom.

```
BlogPost {
  id, title, slug, authorId, category, tags[], isFeatured,
  readTimeMinutes, coverImageUrl, publishedAt, createdAt, updatedAt
}

BlogPostTranslation {
  id, blogPostId, locale, title, body
}
```

---

## 4. Internationalization — Getting Translation Right

Two distinct problems:

**A. UI string translation** (buttons, labels, navigation, static page copy)
- `next-intl`, locale-specific JSON message files, load only the active locale's bundle.
- Full RTL layout support for Arabic using logical CSS properties (`margin-inline-start`, etc.) rather than a separate RTL stylesheet.

**B. Dynamic content translation** (blog posts, certification descriptions, syllabus notes)
- Store a **translation table per translatable entity** (`BlogPostTranslation`, `CertificationTranslation`) keyed by `locale`.
- Admins/instructors write or approve translations at publish time — ideally reviewed by a native speaker — with an optional "auto-translate draft" helper as a starting point they edit before publishing. Never auto-publish machine-translated content for a certification body where accuracy matters.
- Fall back to English (or the source locale) if a translation is missing, rather than showing blank content.
- Cache resolved translations in Redis keyed by `(entityId, locale)`.
- Persist the user's language preference (cookie + profile field) rather than re-detecting from the browser each session.

---

## 5. Syllabus Resource Management

- Admins upload/manage syllabus PDFs per certification, stored in MinIO.
- Track file name, size, upload date, uploader.
- Students download from the certification detail page; use signed URLs with short expiry if access should be gated to enrolled students only.

```
SyllabusFile {
  id, certificationId, fileName, fileUrl, fileSizeKb, uploadedBy, uploadedAt
}
```

---

## 6. Page & Route Structure

### Public Pages (use ISR/SSG — highest traffic, least frequent change)
| Route | Purpose |
|---|---|
| `/` | Hero, key stats (e.g., 95% pass rate), why choose ESTQB, featured certifications |
| `/about` | Mission, vision, board structure |
| `/certifications` | Full catalog: courses, exam dates, prices, syllabus downloads |
| `/blog`, `/blog/[id]` | Newsroom with search and category filters |
| `/contact` | Contact form, email, Addis Ababa location |
| `/verify-certificate` | Public certificate lookup by certificate number — no login required |

### Auth Pages
| Route | Purpose |
|---|---|
| `/auth/signup` | Candidate registration |
| `/auth/signin` | Standard login |
| `/admin/login` | Admin/instructor login (stricter rate limiting) |

### Student Portal (role: candidate)
| Route | Purpose |
|---|---|
| `/student/dashboard` | Enrolled courses, progress, upcoming exam dates |
| `/student/certificates` | View and download earned certificates (admin-uploaded files) |

### Admin Portal (role: admin or instructor)
| Route | Purpose |
|---|---|
| `/admin/dashboard` | Manage blog posts, view enrollments, oversee syllabus uploads, issue certificates |
| `/admin/superadmin` | (admin only) Manage accounts, assign roles, system-wide metrics |

---

## 7. Performance Checklist

- ISR/SSG for all public marketing pages; revalidate on content change via webhook, not a timer.
- Redis cache for: certification catalog, published blog list, resolved translations.
- `next/image` for all images with proper `sizes`.
- Database indexes on all foreign keys and on `certificateNumber`, `slug`, `locale` lookup columns.
- Paginate all list endpoints (blog, enrollments, admin tables).
- CDN or aggressive Caddy caching headers for static assets and MinIO-served files.

---

## 8. Other Non-Functional Requirements

- **Accessibility**: semantic HTML, ARIA labels, full keyboard navigation, screen-reader tested on the RTL (Arabic) layout.
- **Security**: input validation (zod schemas shared client/server), rate limiting on auth + verification endpoints, httpOnly+secure cookies, CSRF protection, signed URLs for private files, file-type/size validation on all uploads (syllabus + certificates).
- **SEO**: metadata, `sitemap.xml`, `hreflang` tags per locale, SSR/SSG for public pages.
- **Error handling**: consistent API error shape, friendly 404/500 pages per locale.
- **Observability**: structured logging + self-hosted error tracking (e.g., a self-hosted Sentry instance, or simple log aggregation) from day one.
- **Backups**: automated, tested restore process for Postgres + MinIO — not optional on a self-hosted single VPS.

---

## 9. Deliverables Requested

1. `docker-compose.yml` running Next.js, Postgres, Redis, MinIO, Meilisearch, and Caddy together
2. Database schema/migrations for all models above, including translation tables
3. Auth system with RBAC middleware (Auth.js/Lucia)
4. Fully functional public pages with ISR
5. Student and Admin portals with protected routing
6. Blog CMS with create/edit/publish + translation workflow
7. i18n fully wired for English + Amharic + Arabic (to validate RTL), scaffolded for the remaining 12
8. Admin certificate upload flow + public `/verify-certificate` page
9. Backup scripts (Postgres dump + MinIO sync) with a documented restore procedure
10. Seed data: sample certifications, blog posts, and one user per role

---

## Instructions for the AI/Developer
- Target the self-hosted Docker Compose stack above; do not introduce paid managed services unless explicitly requested.
- Certificate issuance is a manual admin upload — do not build PDF generation/rendering.
- Build incrementally: infra (Docker Compose) → auth → data models → public pages (ISR) → student portal → admin portal (incl. certificate upload) → blog → translation workflow.
- Treat dynamic content translation as a data-modeling problem (translation tables + fallback), not a request-time API call.
- Include TypeScript types/interfaces for all data models and zod schemas for all API input.
- Write clean, commented, production-quality code with a consistent folder structure.
