import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { auth } from '@/auth';

export default async function StudentLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const session = await auth();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-64 border-r border-border/40 bg-card hidden md:block">
        <div className="p-6">
          <p className="font-semibold text-lg mb-1">Student Portal</p>
          <p className="text-sm text-muted-foreground">{session?.user?.name}</p>
        </div>
        <nav className="space-y-1 px-4">
          <Link 
            href="/student/dashboard" 
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Dashboard
          </Link>
          <Link 
            href="/student/certificates" 
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            My Certificates
          </Link>
        </nav>
      </aside>
      
      <main className="flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
