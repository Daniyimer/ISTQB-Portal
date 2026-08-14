'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export function ApproveEnrollmentButton({ enrollmentId }: { enrollmentId: string }) {
  const [isApproving, setIsApproving] = useState(false);
  const router = useRouter();

  async function handleApprove() {
    setIsApproving(true);
    try {
      const res = await fetch(`/api/admin/enrollments/${enrollmentId}/approve`, {
        method: 'PATCH',
      });
      if (res.ok) {
        router.refresh();
      } else {
        setIsApproving(false);
      }
    } catch {
      setIsApproving(false);
    }
  }

  return (
    <button
      onClick={handleApprove}
      disabled={isApproving}
      className={buttonVariants({ size: 'sm', className: 'gap-1' })}
    >
      {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
      {isApproving ? 'Approving...' : 'Approve Access'}
    </button>
  );
}
