'use client';

import { buttonVariants } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function EnrollButton({ certificationId, locale }: { certificationId: string; locale: string }) {
  const router = useRouter();

  function handleEnroll() {
    router.push(`/${locale}/student/checkout/${certificationId}`);
  }

  return (
    <button
      type="button"
      onClick={handleEnroll}
      className={buttonVariants({ className: 'gap-2 font-semibold' })}
    >
      Enroll Now
    </button>
  );
}
