import { setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { UserTable } from '@/components/admin/UserTable';

export default async function SuperAdminUsersPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    redirect(`/${locale}/auth/signin`);
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
    }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
        <p className="text-muted-foreground">Add or remove candidates, instructors, and blog managers.</p>
      </div>
      
      <UserTable users={users} />
    </div>
  );
}
