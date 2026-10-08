# ISTQB Ethiopia - Professional Certification Portal

Welcome to the official Learning & Certification Portal for **ISTQB Ethiopia**.

ISTQB Ethiopia is a Non-Governmental Organization (NGO) and a national representative of the **International Software Testing Qualifications Board (ISTQB)**—the world's leading organization for software testing certification. 

Our mission is to empower students and IT professionals in Ethiopia by providing access to the globally recognized ISTQB knowledge framework. Through this platform, we support the testing community by fostering a standardized language, promoting software quality innovations, and offering vendor-neutral, globally recognized certifications (Foundation, Advanced, and Expert levels).

## 🌟 Core Objectives

- **Empowerment Through Education**: Providing students with structured, professional learning materials to prepare for ISTQB examinations across Core, Agile, and Specialist streams.
- **Global Professional Certification**: Issuing internationally recognized credentials that validate software testing competencies and help professionals advance their careers globally.
- **Seamless Administration**: Enabling our staff to efficiently manage enrollments, track student progress, and distribute official ISTQB syllabus materials.

## ✨ Key Features

- **🎓 Student Dashboard**: A professional, distraction-free environment where candidates can track their active enrollments, monitor course progress, and view earned certificates.
- **🛠️ Administrative Portal**: Comprehensive staff tools to upload official syllabus PDFs, evaluate student enrollments, and manage course data.
- **📄 Interactive Syllabus Tracking**: Students can view official study materials directly within the browser and track their completion status.
- **🌍 Multilingual Interface**: Built-in support for multiple languages to ensure accessibility for a diverse student base across the region.

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
*Developed for ISTQB Ethiopia to advance software quality engineering education and connect local professionals to global standards.*
