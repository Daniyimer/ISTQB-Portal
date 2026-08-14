import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(async () => {
      // Also handle form data
      const formData = await request.formData();
      return { certificationId: formData.get('certificationId') as string };
    });

    const { certificationId } = body;

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

    // Upsert enrollment (idempotent)
    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_certificationId: {
          userId: session.user.id,
          certificationId,
        }
      },
      update: {},
      create: {
        userId: session.user.id,
        certificationId,
        status: 'ACTIVE',
        progressPercent: 0,
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
