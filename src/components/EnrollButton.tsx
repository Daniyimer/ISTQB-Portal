'use client';

import { useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function EnrollButton({ certificationId, locale }: { certificationId: string; locale: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const router = useRouter();

  async function handleEnroll() {
    setState('loading');
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificationId }),
      });

      if (res.status === 401) {
        // Not logged in — redirect to sign in
        router.push(`/${locale}/auth/signin`);
        return;
      }

      if (res.ok) {
        setState('done');
        router.refresh();
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600">
        <CheckCircle2 className="h-4 w-4" /> Enrolled!
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleEnroll}
      disabled={state === 'loading'}
      className={buttonVariants({ className: 'gap-2 font-semibold' })}
    >
      {state === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
      {state === 'loading' ? 'Enrolling...' : state === 'error' ? 'Try Again' : 'Enroll Now'}
    </button>
  );
}
