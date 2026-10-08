import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  const session = await auth();

  // Basic admin authorization check
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const certificationId = formData.get('certificationId') as string;
    const file = formData.get('file') as File | null;

    if (!certificationId || !file) {
      return NextResponse.json({ error: 'Certification ID and File are required.' }, { status: 400 });
    }

    // Ensure it's a PDF
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Ensure directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'syllabus');
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const filename = `${certificationId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filepath = join(uploadDir, filename);
    
    await writeFile(filepath, buffer);
    const fileUrl = `/uploads/syllabus/${filename}`;
    const fileSizeKb = Math.round(buffer.length / 1024);

    // Save to database
    const syllabusFile = await prisma.syllabusFile.create({
      data: {
        certificationId,
        fileName: file.name,
        fileUrl,
        fileSizeKb,
        uploadedBy: session.user.id,
      }
    });

    return NextResponse.json({ success: true, syllabusFile }, { status: 201 });
  } catch (error: any) {
    console.error('Syllabus upload error:', error);
    return NextResponse.json({ error: 'Failed to upload syllabus file.' }, { status: 500 });
  }
}
