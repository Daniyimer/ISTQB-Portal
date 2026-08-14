import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: enrollmentId } = await params;
    const body = await request.json();
    const { progressPercent } = body;

    if (typeof progressPercent !== 'number' || progressPercent < 0 || progressPercent > 100) {
      return NextResponse.json({ error: 'Invalid progress percentage' }, { status: 400 });
    }

    // Ensure the enrollment belongs to the user
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId }
    });

    if (!existingEnrollment || existingEnrollment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Enrollment not found or unauthorized' }, { status: 404 });
    }

    // Determine status based on progress
    let status = existingEnrollment.status;
    if (progressPercent === 100) {
      status = 'COMPLETED';
    } else if (progressPercent > 0 && status === 'ACTIVE') {
      status = 'IN_PROGRESS';
    }

    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progressPercent,
        status,
        ...(progressPercent === 100 && !existingEnrollment.completedAt ? { completedAt: new Date() } : {})
      }
    });

    return NextResponse.json({ success: true, enrollment: updatedEnrollment });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
