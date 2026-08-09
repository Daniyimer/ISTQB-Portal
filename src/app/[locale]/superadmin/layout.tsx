import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { auth } from '@/auth';

export default async function SuperAdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const session = await auth();

  if (!session) {
    return <main className="flex-1 bg-muted/20">{children}</main>;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-64 border-r border-border/40 bg-card hidden md:block">
        <div className="p-6">
          <p className="font-semibold text-lg mb-1 text-destructive">Super Admin</p>
          <p className="text-sm text-muted-foreground">{session?.user?.name}</p>
          <p className="text-xs text-muted-foreground mt-1 capitalize">{session?.user?.role?.toLowerCase()}</p>
        </div>
        <nav className="space-y-1 px-4">
          <Link 
            href="/superadmin/dashboard" 
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Overview
          </Link>
          <Link 
            href="/superadmin/users" 
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Manage Users
          </Link>
          <div className="mt-8 pt-4 border-t border-border/40">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Staff Portals</p>
            <Link 
              href="/admin/dashboard" 
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            >
              Access Staff Portal
            </Link>
          </div>
        </nav>
      </aside>
      
      <main className="flex-1 p-6 md:p-10 bg-muted/20">
        {children}
      </main>
    </div>
  );
}
