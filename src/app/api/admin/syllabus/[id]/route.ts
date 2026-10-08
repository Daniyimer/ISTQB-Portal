import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  // Admin authorization check
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Find the file in the database
    const syllabusFile = await prisma.syllabusFile.findUnique({
      where: { id }
    });

    if (!syllabusFile) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Delete the file from the database
    await prisma.syllabusFile.delete({
      where: { id }
    });

    // Attempt to delete the physical file from the disk
    try {
      if (syllabusFile.fileUrl.startsWith('/uploads/syllabus/')) {
        const filename = syllabusFile.fileUrl.split('/').pop();
        if (filename) {
          const filepath = join(process.cwd(), 'public', 'uploads', 'syllabus', filename);
          await unlink(filepath);
        }
      }
    } catch (fsError) {
      console.warn('Could not delete physical file, but database record was removed:', fsError);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Delete syllabus error:', error);
    return NextResponse.json({ error: 'Failed to delete syllabus file' }, { status: 500 });
  }
}
