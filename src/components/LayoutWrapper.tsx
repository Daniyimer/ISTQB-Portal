"use client";

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminArea = pathname.includes('/admin') || pathname.includes('/superadmin') || pathname.includes('/student');

  return (
    <div className="flex min-h-screen flex-col bg-background relative">
      {!isAdminArea && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#009A44] opacity-20 dark:opacity-10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
          <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] rounded-full bg-[#FED100] opacity-20 dark:opacity-10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse delay-700"></div>
          <div className="absolute bottom-[10%] left-[10%] w-[55%] h-[55%] rounded-full bg-[#EF3340] opacity-15 dark:opacity-5 blur-[140px] mix-blend-multiply dark:mix-blend-screen animate-pulse delay-1000"></div>
        </div>
      )}
      {!isAdminArea && <Header />}
      <main className="flex-1 relative z-10">{children}</main>
      {!isAdminArea && <Footer />}
    </div>
  );
}
