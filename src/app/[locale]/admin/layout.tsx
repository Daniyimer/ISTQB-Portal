import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { auth } from '@/auth';
import { LayoutDashboard, Award, BookOpen, FileText, Shield, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

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
    return <main className="flex-1">{children}</main>;
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true },
    { href: '/admin/certificates', label: 'Issue Certificates', icon: Award, show: isInstructor },
    { href: '/admin/syllabus', label: 'Manage Syllabus', icon: BookOpen, show: isInstructor },
    { href: '/admin/blog', label: 'Blog CMS', icon: FileText, show: isBlogManager },
  ].filter(item => item.show);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] relative">
      {/* Background animation orbs (same as public pages) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#009A44] opacity-10 dark:opacity-5 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" />
        <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] rounded-full bg-[#FED100] opacity-10 dark:opacity-5 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse delay-700" />
        <div className="absolute bottom-[10%] left-[10%] w-[55%] h-[55%] rounded-full bg-[#EF3340] opacity-8 dark:opacity-3 blur-[140px] mix-blend-multiply dark:mix-blend-screen animate-pulse delay-1000" />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-64 hidden md:flex flex-col bg-card/80 backdrop-blur-2xl border-r border-foreground/10 shadow-sm">
        {/* Portal Header */}
        <div className="p-6 border-b border-foreground/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-primary">Staff Portal</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{role?.toLowerCase()}</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-2 mt-2 bg-primary/5 border border-primary/10 rounded-lg px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
              {session?.user?.name?.charAt(0) || 'A'}
            </div>
            <p className="text-sm font-medium truncate">{session?.user?.name}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}

          {role === 'ADMIN' && (
            <div className="mt-8 pt-4 border-t border-foreground/10">
              <Link
                href="/superadmin/dashboard"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
              >
                <Shield className="h-4 w-4 shrink-0" />
                Super Admin Panel
              </Link>
            </div>
          )}
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="relative z-10 flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
