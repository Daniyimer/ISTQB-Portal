import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/estqb?schema=public' })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Create Admins and Instructors
  const adminPassword = await bcrypt.hash('admin123', 10)
  const candidatePassword = await bcrypt.hash('candidate123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@estqb-ethiopia.org' },
    update: {},
    create: {
      email: 'admin@estqb-ethiopia.org',
      fullName: 'System Admin',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      isVerified: true,
    },
  })

  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@estqb-ethiopia.org' },
    update: {},
    create: {
      email: 'instructor@estqb-ethiopia.org',
      fullName: 'Lead Instructor',
      passwordHash: adminPassword,
      role: Role.INSTRUCTOR,
      isVerified: true,
    },
  })

  const candidate = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      fullName: 'Jane Doe',
      passwordHash: candidatePassword,
      role: Role.CANDIDATE,
      isVerified: true,
    },
  })

  // 2. Create Certifications
  const ctfl = await prisma.certification.create({
    data: {
      title: 'CTFL - Foundation Level',
      level: 'Foundation',
      description: 'The standard qualification for software testing professionals globally.',
      price: 150.00,
      passRate: 95.5,
      translations: {
        create: [
          { locale: 'en', title: 'CTFL - Foundation Level', description: 'The standard qualification...' },
          { locale: 'am', title: 'CTFL - የመሠረታዊ ደረጃ', description: 'ዓለም አቀፍ ዕውቅና ያለው የሶፍትዌር መፈተሻ...' },
          { locale: 'ar', title: 'CTFL - المستوى التأسيسي', description: 'المؤهل القياسي لمحترفي اختبار البرمجيات على مستوى العالم.' }
        ]
      }
    }
  })

  // 3. Create Sample Blog Post
  const blog = await prisma.blogPost.create({
    data: {
      title: 'Welcome to ESTQB Ethiopia',
      slug: 'welcome-to-estqb-ethiopia',
      authorId: admin.id,
      category: 'Announcements',
      tags: ['ESTQB', 'Ethiopia', 'Launch'],
      isFeatured: true,
      readTimeMinutes: 2,
      publishedAt: new Date(),
      translations: {
        create: [
          { locale: 'en', title: 'Welcome to ESTQB Ethiopia', body: '<p>We are thrilled to announce the launch of the official ESTQB member board for Ethiopia.</p>' },
          { locale: 'am', title: 'እንኳን ወደ ESTQB ኢትዮጵያ በደህና መጡ', body: '<p>ለኢትዮጵያ ይፋዊ የሆነውን የESTQB አባል ቦርድ መጀመሩን ስናበስር በታላቅ ደስታ ነው።</p>' },
          { locale: 'ar', title: 'مرحبًا بكم في ESTQB إثيوبيا', body: '<p>يسعدنا أن نعلن عن إطلاق المجلس العضو الرسمي لـ ESTQB في إثيوبيا.</p>' }
        ]
      }
    }
  })

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
