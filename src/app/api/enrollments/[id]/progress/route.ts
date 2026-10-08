import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
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
    const { syllabusFileId, completed } = body;

    if (!syllabusFileId || typeof completed !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Verify enrollment belongs to user
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId, userId: session.user.id },
      include: {
        certification: {
          include: {
            syllabusFiles: true
          }
        }
      }
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    // Verify syllabus file exists in this certification
    const totalFiles = enrollment.certification.syllabusFiles.length;
    const fileExists = enrollment.certification.syllabusFiles.some(f => f.id === syllabusFileId);
    if (!fileExists) {
      return NextResponse.json({ error: 'Syllabus file not part of this course' }, { status: 400 });
    }

    // Update completed array
    let updatedCompletedIds = [...enrollment.completedSyllabusIds];
    if (completed && !updatedCompletedIds.includes(syllabusFileId)) {
      updatedCompletedIds.push(syllabusFileId);
    } else if (!completed && updatedCompletedIds.includes(syllabusFileId)) {
      updatedCompletedIds = updatedCompletedIds.filter(id => id !== syllabusFileId);
    }

    // Recalculate progress (ensure it doesn't exceed 100 or drop below 0)
    let newProgress = 0;
    if (totalFiles > 0) {
      newProgress = (updatedCompletedIds.length / totalFiles) * 100;
    }
    
    // If progress reaches 100% and it was IN_PROGRESS, maybe mark as completed? Or just let the exam do it.
    // Let's just update the progress percent.

    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        completedSyllabusIds: updatedCompletedIds,
        progressPercent: newProgress,
      }
    });

    return NextResponse.json({ success: true, progressPercent: newProgress, completedSyllabusIds: updatedCompletedIds });
  } catch (error: any) {
    console.error('Failed to update progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
