import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { auth } from '@/auth';
import { LayoutDashboard, Users, Shield, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogoutButton } from '@/components/LogoutButton';

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
    return <main className="flex-1">{children}</main>;
  }

  const navItems = [
    { href: '/superadmin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/superadmin/users', label: 'Manage Users', icon: Users },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] relative">
      {/* Background animation orbs — slightly more red-tinted for Super Admin to distinguish */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-[#EF3340] opacity-10 dark:opacity-5 blur-[140px] mix-blend-multiply dark:mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[5%] left-[-5%] w-[50%] h-[50%] rounded-full bg-[#009A44] opacity-8 dark:opacity-4 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse delay-700" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-[#FED100] opacity-8 dark:opacity-3 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse delay-1000" />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-64 hidden md:flex flex-col bg-card/80 backdrop-blur-2xl border-r border-destructive/10 shadow-sm">
        {/* Portal Header */}
        <div className="p-6 border-b border-destructive/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-destructive">Super Admin</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">System Control</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-2 mt-2 bg-destructive/5 border border-destructive/10 rounded-lg px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-destructive/20 flex items-center justify-center text-destructive text-xs font-bold">
              {session?.user?.name?.charAt(0) || 'S'}
            </div>
            <p className="text-sm font-medium truncate">{session?.user?.name}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <div className="mb-4 pb-4 border-b border-foreground/10">
            <LogoutButton />
          </div>
          
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}

          <div className="mt-8 pt-4 border-t border-destructive/10">
            <p className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Staff Portals</p>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              Staff Portal
            </Link>
          </div>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="relative z-10 flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
