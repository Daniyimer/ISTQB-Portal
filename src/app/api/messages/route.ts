import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const role = (session.user as any).role as string;
  const isStaff = role === 'ADMIN' || role === 'INSTRUCTOR';

  // Staff sees all messages sent to them; students see their own threads
  const messages = await prisma.message.findMany({
    where: isStaff
      ? { recipientId: userId, parentId: null } // staff inbox: top-level messages
      : { senderId: userId, parentId: null },   // student: their own threads
    include: {
      sender: { select: { id: true, fullName: true, email: true } },
      recipient: { select: { id: true, fullName: true, email: true } },
      certification: { select: { id: true, title: true } },
      replies: {
        include: {
          sender: { select: { id: true, fullName: true, email: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { subject, body: msgBody, recipientId, certificationId, parentId } = body;

  if (!msgBody || (!subject && !parentId)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // For a reply, find the parent to inherit subject
  let resolvedSubject = subject;
  let resolvedRecipientId = recipientId;

  if (parentId) {
    const parent = await prisma.message.findUnique({
      where: { id: parentId },
      select: { subject: true, senderId: true, recipientId: true },
    });
    if (!parent) return NextResponse.json({ error: 'Parent message not found' }, { status: 404 });
    resolvedSubject = `Re: ${parent.subject}`;
    // Reply goes back to the original sender
    resolvedRecipientId = parent.senderId;
  }

  // If no specific recipient, route to all admins/instructors (pick first available)
  if (!resolvedRecipientId) {
    const staff = await prisma.user.findFirst({
      where: { role: { in: ['ADMIN', 'INSTRUCTOR'] } },
      select: { id: true },
    });
    resolvedRecipientId = staff?.id ?? null;
  }

  const message = await prisma.message.create({
    data: {
      senderId: session.user.id,
      recipientId: resolvedRecipientId,
      certificationId: certificationId ?? null,
      subject: resolvedSubject,
      body: msgBody,
      parentId: parentId ?? null,
    },
    include: {
      sender: { select: { fullName: true, email: true } },
      recipient: { select: { fullName: true, email: true } },
    },
  });

  return NextResponse.json({ success: true, message }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  // Mark message as read
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { messageId } = await request.json();
  await prisma.message.updateMany({
    where: { id: messageId, recipientId: session.user.id },
    data: { isRead: true },
  });

  return NextResponse.json({ success: true });
}
