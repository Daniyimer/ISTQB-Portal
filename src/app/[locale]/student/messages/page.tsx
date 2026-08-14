import { setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { StudentMessagesClient } from '@/components/StudentMessagesClient';
import { redirect } from 'next/navigation';

export default async function StudentMessagesPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  // Get certifications the student is enrolled in
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      enrollments: {
        include: { certification: { select: { id: true, title: true } } }
      }
    }
  });

  const certifications = user?.enrollments.map(e => e.certification) || [];

  // Get student's top-level messages
  const messages = await prisma.message.findMany({
    where: { senderId: session.user.id, parentId: null },
    include: {
      certification: { select: { title: true } },
      replies: {
        include: {
          sender: { select: { fullName: true, email: true, role: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-1">Communicate with your instructors and ask questions.</p>
      </div>

      <StudentMessagesClient 
        certifications={certifications}
        messages={JSON.parse(JSON.stringify(messages))}
        userRole={session.user.role as string}
      />
    </div>
  );
}
