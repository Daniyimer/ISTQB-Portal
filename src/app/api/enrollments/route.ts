import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  try {
    let certificationId = '';
    let paymentScreenshotUrl: string | undefined = undefined;

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      certificationId = formData.get('certificationId') as string;
      
      const file = formData.get('paymentScreenshot') as File | null;
      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Ensure directory exists
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'payments');
        await mkdir(uploadDir, { recursive: true });

        // Generate unique filename
        const filename = `${session.user.id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const filepath = join(uploadDir, filename);
        
        await writeFile(filepath, buffer);
        paymentScreenshotUrl = `/uploads/payments/${filename}`;
      }
    } else {
      // Fallback for JSON requests
      const body = await request.json();
      certificationId = body.certificationId;
    }

    if (!certificationId) {
      return NextResponse.json({ error: 'certificationId is required.' }, { status: 400 });
    }

    // Check certification exists
    const certification = await prisma.certification.findUnique({
      where: { id: certificationId }
    });

    if (!certification) {
      return NextResponse.json({ error: 'Certification not found.' }, { status: 404 });
    }

    // Upsert enrollment as PENDING (or update existing if PENDING)
    // If it's already ACTIVE/COMPLETED, we shouldn't downgrade it, but for simplicity we'll just upsert
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_certificationId: {
          userId: session.user.id,
          certificationId,
        }
      }
    });

    if (existing && existing.status !== 'PENDING') {
      return NextResponse.json({ error: 'Already enrolled and active.' }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_certificationId: {
          userId: session.user.id,
          certificationId,
        }
      },
      update: {
        paymentScreenshot: paymentScreenshotUrl || existing?.paymentScreenshot,
        status: 'PENDING'
      },
      create: {
        userId: session.user.id,
        certificationId,
        status: 'PENDING',
        progressPercent: 0,
        paymentScreenshot: paymentScreenshotUrl,
      },
    });

    return NextResponse.json({ success: true, enrollment }, { status: 201 });
  } catch (error: any) {
    console.error('Enrollment error:', error);
    return NextResponse.json({ error: 'Failed to enroll. Please try again.' }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      certification: {
        include: { translations: true }
      }
    },
    orderBy: { enrolledAt: 'desc' }
  });

  return NextResponse.json({ enrollments });
}
