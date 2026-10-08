# Learning & Certification Portal 🎓

Welcome to the Learning & Certification Portal! This is a modern, full-stack web application designed to help students track their course progress, view syllabus materials, and earn certificates, while giving administrators the tools they need to manage it all.

## ✨ Features

- **🎓 Student Dashboard**: A clean, distraction-free interface where students can track their enrollments, view course progress, and access study materials.
- **🛠️ Admin/Staff Portal**: Dedicated staff tools to upload syllabus PDFs, manage student enrollments, and track course completion.
- **📄 Interactive Learning**: Students can view and check off individual syllabus materials right inside the browser.
- **🌍 Multi-language Support**: Built-in support for different languages (English, Arabic, etc.) using `next-intl`.
- **🌙 Modern UI**: Fully responsive, featuring a sleek dark mode, glassmorphism aesthetics, and smooth animations.

## 🚀 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) managed via [Prisma ORM](https://www.prisma.io/)
- **Authentication**: NextAuth.js
- **Containerization**: Docker & Docker Compose (for local DB/Redis/Minio services)

## 💻 Getting Started

To run this project locally on your machine:

1. **Start the database services** (PostgreSQL, Redis, Minio):
   ```bash
   docker-compose up -d postgres redis minio meilisearch
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run database migrations**:
   ```bash
   npx prisma db push
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action!

---
*Built with ❤️ for a better learning experience.*
