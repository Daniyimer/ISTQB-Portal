import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = session?.user?.role as string | undefined;

    if (!session?.user?.id || (role !== 'ADMIN' && role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: enrollmentId } = await params;

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId }
    });

    if (!existingEnrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: 'ACTIVE'
      }
    });

    return NextResponse.json({ success: true, enrollment: updatedEnrollment });
  } catch (error) {
    console.error('Error approving enrollment:', error);
    return NextResponse.json({ error: 'Failed to approve enrollment' }, { status: 500 });
  }
}
