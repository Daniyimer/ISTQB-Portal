'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/auth/signin' })}
      className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
    >
      <LogOut className="h-4 w-4 shrink-0" />
      Sign Out
    </button>
  );
}
