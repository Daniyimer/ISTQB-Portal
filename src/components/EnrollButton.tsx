'use client';

import { buttonVariants } from '@/components/ui/button';

export function EnrollButton({ certificationId, locale }: { certificationId: string; locale: string }) {
  return (
    <a
      href={`/${locale}/student/checkout/${certificationId}`}
      className={buttonVariants({ className: 'gap-2 font-semibold' })}
    >
      Enroll Now
    </a>
  );
}
