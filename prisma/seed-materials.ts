import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/estqb?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding demo materials for all certifications...');
  
  const certifications = await prisma.certification.findMany();
  
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  const uploadedBy = admin ? admin.id : 'system';

  for (const cert of certifications) {
    const existing = await prisma.syllabusFile.findFirst({ where: { certificationId: cert.id } });
    if (existing) continue;

    await prisma.syllabusFile.createMany({
      data: [
        {
          certificationId: cert.id,
          fileName: 'Course Introduction & Syllabus.pdf',
          fileUrl: '/demo-syllabus.pdf',
          fileSizeKb: 1024,
          uploadedBy,
        },
        {
          certificationId: cert.id,
          fileName: 'Chapter 1 Study Guide.pdf',
          fileUrl: '/demo-study-guide.pdf',
          fileSizeKb: 2048,
          uploadedBy,
        }
      ]
    });
  }

  console.log('Finished seeding materials!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
