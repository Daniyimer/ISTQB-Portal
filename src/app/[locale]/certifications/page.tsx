import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { Clock, Tag, Percent, CheckCircle2 } from 'lucide-react';
import { EnrollButton } from '@/components/EnrollButton';

export default async function CertificationsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  
  const [certifications, userEnrollments] = await Promise.all([
    prisma.certification.findMany({
      include: { translations: true }
    }),
    session?.user?.id ? prisma.enrollment.findMany({
      where: { userId: session.user.id },
      select: { certificationId: true }
    }) : []
  ]);

  const enrolledIds = new Set(userEnrollments.map(e => e.certificationId));

  return (
    <div className="flex flex-col flex-1 w-full bg-transparent relative">
      {/* Hero */}
      <section className="relative z-10 container mx-auto px-4 sm:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground pb-2">
            ESTQB Certifications
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Unlock new career milestones with our globally recognized testing syllabi. Access materials and register for examinations in Ethiopia.
          </p>
          {!session && (
            <p className="text-sm text-muted-foreground">
              <Link href="/auth/signin" className="text-primary font-semibold hover:underline">Sign in</Link> to enroll in a certification.
            </p>
          )}
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="relative z-10 container mx-auto px-4 sm:px-8 py-16 bg-card/80 backdrop-blur-2xl border border-foreground/15 rounded-3xl shadow-sm mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert) => {
            const trans = cert.translations.find(tr => tr.locale === locale) || cert.translations.find(tr => tr.locale === 'en') || cert;
            const isEnrolled = enrolledIds.has(cert.id);
            return (
              <div key={cert.id} className="bg-primary/10 border border-primary/20 rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group">
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider mb-4">
                    {cert.level}
                  </span>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{trans.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-4 leading-relaxed">
                    {trans.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {cert.durationWeeks && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary/60" />
                        <span>Recommended Duration: {cert.durationWeeks} weeks</span>
                      </div>
                    )}
                    {cert.passRate && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Percent className="h-4 w-4 text-primary/60" />
                        <span>Board Average Pass Rate: {cert.passRate}%</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-6 border-t border-primary/20 flex justify-between items-center">
                  <div className="flex items-center gap-1 text-lg font-bold text-foreground">
                    <Tag className="h-4 w-4 text-primary/60" />
                    <span>${cert.price.toFixed(2)}</span>
                  </div>
                  {isEnrolled ? (
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600">
                      <CheckCircle2 className="h-4 w-4" /> Enrolled
                    </span>
                  ) : (
                    <EnrollButton certificationId={cert.id} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {certifications.length === 0 && (
          <div className="text-center p-12 bg-primary/10 border border-primary/20 rounded-2xl text-muted-foreground">
            No certifications registered in database.
          </div>
        )}
      </section>
    </div>
  );
}
