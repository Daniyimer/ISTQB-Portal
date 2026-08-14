'use client';

import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

export function EnrollButton({ certificationId }: { certificationId: string }) {
  return (
    <Link
      href={`/student/checkout/${certificationId}`}
      className={buttonVariants({ className: 'gap-2 font-semibold' })}
    >
      Enroll Now
    </Link>
  );
}
