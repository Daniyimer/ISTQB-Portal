import { setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { CheckoutClient } from '@/components/CheckoutClient';

export default async function StudentCheckoutPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id: certificationId } = await params;
  setRequestLocale(locale);
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const cert = await prisma.certification.findUnique({
    where: { id: certificationId },
    include: {
      translations: true,
    }
  });

  if (!cert) {
    notFound();
  }

  const trans = cert.translations.find(t => t.locale === locale) || cert.translations.find(t => t.locale === 'en');

  // Check if they are already enrolled
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_certificationId: {
        userId: session.user.id,
        certificationId: cert.id
      }
    }
  });

  if (existingEnrollment) {
    redirect('/student/dashboard'); // already enrolled or pending, go to dashboard
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <Link href="/certifications" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </Link>
        <h1 className="text-3xl font-extrabold mb-2">Enrollment Checkout</h1>
        <p className="text-muted-foreground">Complete your payment to gain access to the course.</p>
      </div>

      {/* Course Summary */}
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
          <BookOpen className="h-6 w-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2 inline-block">
            {cert.level}
          </span>
          <h2 className="text-lg font-bold">{trans?.title || cert.title}</h2>
          <p className="text-sm font-semibold mt-1">Price: <span className="text-primary text-base">${cert.price.toFixed(2)}</span></p>
        </div>
      </div>

      {/* Interactive Checkout */}
      <CheckoutClient certificationId={cert.id} price={cert.price} />

    </div>
  );
}
