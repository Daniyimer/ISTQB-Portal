# ISTQB Ethiopia - Professional Certification Portal

Welcome to the official Learning & Certification Portal for **ISTQB Ethiopia**. 

ISTQB Ethiopia is a Non-Governmental Organization (NGO) dedicated to empowering students and IT professionals through accessible, high-quality education and globally recognized professional certifications in software testing. This portal serves as the centralized platform for students to manage their learning journey and for our administration to seamlessly facilitate the certification process.

## 🌟 Core Objectives

- **Empowerment Through Education**: Providing students with structured, professional learning materials to prepare for ISTQB examinations.
- **Professional Certification**: Issuing globally recognized credentials to validate software testing competencies.
- **Seamless Administration**: Enabling our staff to efficiently manage enrollments, track student progress, and distribute syllabus materials.

## ✨ Key Features

- **🎓 Student Dashboard**: A professional, distraction-free environment where candidates can track their active enrollments, monitor course progress, and view earned certificates.
- **🛠️ Administrative Portal**: Comprehensive staff tools to upload official syllabus PDFs, evaluate student enrollments, and manage course data.
- **📄 Interactive Syllabus Tracking**: Students can view official study materials directly within the browser and track their completion status.
- **🌍 Multilingual Interface**: Built-in support for multiple languages to ensure accessibility for a diverse student base.

## 🚀 Technical Architecture

This platform is engineered using a modern, robust technology stack:

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database Management**: [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM](https://www.prisma.io/)
- **Authentication**: NextAuth.js
- **Infrastructure**: Docker & Docker Compose (for local PostgreSQL, Redis, and Minio services)

## 💻 Local Development Setup

To run this project locally for development or contributions:

1. **Initialize Infrastructure** (PostgreSQL, Redis, Minio):
   ```bash
   docker-compose up -d postgres redis minio meilisearch
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run Database Migrations**:
   ```bash
   npx prisma db push
   ```
4. **Launch Development Server**:
   ```bash
   npm run dev
   ```

Access the application at [http://localhost:3000](http://localhost:3000).

---
*Developed for ISTQB Ethiopia to advance software quality engineering education.*
