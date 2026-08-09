"use client";

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminArea = pathname.includes('/admin') || pathname.includes('/superadmin') || pathname.includes('/student');

  return (
    <div className="flex min-h-screen flex-col">
      {!isAdminArea && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdminArea && <Footer />}
    </div>
  );
}
