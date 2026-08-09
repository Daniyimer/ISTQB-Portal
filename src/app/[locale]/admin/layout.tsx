import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { auth } from '@/auth';

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const session = await auth();
  const role = session?.user?.role as string | undefined;

  const isInstructor = role === 'INSTRUCTOR' || role === 'ADMIN';
  const isBlogManager = role === 'BLOG_MANAGER' || role === 'ADMIN';

  if (!session) {
    return <main className="flex-1 bg-muted/20">{children}</main>;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-64 border-r border-border/40 bg-card hidden md:block">
        <div className="p-6">
          <p className="font-semibold text-lg mb-1 text-primary">Staff Portal</p>
          <p className="text-sm text-muted-foreground">{session?.user?.name}</p>
          <p className="text-xs text-muted-foreground mt-1 capitalize">{role?.toLowerCase()}</p>
        </div>
        <nav className="space-y-1 px-4">
          <Link 
            href="/admin/dashboard" 
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Dashboard
          </Link>
          
          {isInstructor && (
            <>
              <Link 
                href="/admin/certificates" 
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                Issue Certificates
              </Link>
              <Link 
                href="/admin/syllabus" 
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                Manage Syllabus
              </Link>
            </>
          )}

          {isBlogManager && (
            <Link 
              href="/admin/blog" 
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Blog CMS
            </Link>
          )}
          
          {role === 'ADMIN' && (
            <div className="mt-8 pt-4 border-t border-border/40">
              <Link 
                href="/superadmin/dashboard" 
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground text-destructive"
              >
                Return to Super Admin
              </Link>
            </div>
          )}
        </nav>
      </aside>
      
      <main className="flex-1 p-6 md:p-10 bg-muted/20">
        {children}
      </main>
    </div>
  );
}
