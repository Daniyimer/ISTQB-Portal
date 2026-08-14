import { setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/routing';
import { Award, BookOpen, CheckCircle2, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export default async function StudentDashboardPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  const userId = session?.user?.id;

  const [enrollments, certificates, allCertifications] = await Promise.all([
    userId ? prisma.enrollment.findMany({
      where: { userId },
      include: {
        certification: {
          include: { translations: true }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    }) : [],
    userId ? prisma.certificate.findMany({
      where: { userId },
      include: {
        certification: { include: { translations: true } }
      },
      orderBy: { issuedAt: 'desc' }
    }) : [],
    prisma.certification.findMany({
      include: { translations: true },
      take: 3,
    }),
  ]);

  const activeEnrollments = enrollments.filter(e => e.status === 'ACTIVE' || e.status === 'IN_PROGRESS' || e.status === 'PENDING');
  const completedEnrollments = enrollments.filter(e => e.status === 'COMPLETED');

  const stats = [
    { label: 'Active Enrollments', value: activeEnrollments.length, icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Completed Courses', value: completedEnrollments.length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-500/10' },
    { label: 'Certificates Earned', value: certificates.length, icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {session?.user?.name?.split(' ')[0] || 'Student'}!</h1>
        <p className="text-muted-foreground mt-1">Track your certification progress below.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-muted-foreground text-sm">{label}</h3>
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-4xl font-extrabold tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* My Enrollments */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> My Enrollments
          </h2>
          <Link href="/certifications" className="text-xs text-primary font-semibold hover:underline">
            Browse all →
          </Link>
        </div>
        {enrollments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-semibold mb-1">No enrollments yet</p>
            <p className="text-sm mb-4">Browse our catalog and enroll in a certification.</p>
            <Link href="/certifications" className={buttonVariants({ size: 'sm' })}>
              Browse Certifications
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {enrollments.map(enrollment => {
              const trans = enrollment.certification.translations.find(t => t.locale === locale) 
                || enrollment.certification.translations.find(t => t.locale === 'en');
              return (
                <div key={enrollment.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{trans?.title || enrollment.certification.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          enrollment.status === 'COMPLETED'
                            ? 'bg-green-500/10 text-green-600'
                            : enrollment.status === 'PENDING'
                            ? 'bg-yellow-500/10 text-yellow-600'
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {enrollment.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    {enrollment.status === 'PENDING' ? (
                      <div className="text-right">
                        <p className="text-sm font-bold text-yellow-600">Pending Verification</p>
                        <p className="text-xs text-muted-foreground mt-1">Admin will approve soon</p>
                      </div>
                    ) : (
                      <>
                        <div className="text-right">
                          <p className="text-sm font-bold">{Math.round(enrollment.progressPercent)}%</p>
                          <div className="w-24 h-1.5 bg-muted rounded-full mt-1">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${enrollment.progressPercent}%` }}
                            />
                          </div>
                        </div>
                        <Link
                          href={`/student/learn/${enrollment.id}`}
                          className={buttonVariants({ variant: 'default', size: 'sm', className: 'gap-1 rounded-full' })}
                        >
                          {enrollment.progressPercent > 0 ? 'Resume' : 'Start Learning'} <ArrowRight className="h-3 w-3" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* My Certificates */}
      {certificates.length > 0 && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" /> My Certificates
            </h2>
          </div>
          <div className="divide-y divide-border">
            {certificates.map(cert => {
              const trans = cert.certification.translations.find(t => t.locale === locale)
                || cert.certification.translations.find(t => t.locale === 'en');
              return (
                <div key={cert.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-600">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{trans?.title || cert.certification.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Certificate No: <span className="font-mono text-primary">{cert.certificateNumber}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    {cert.grade && <p className="font-bold text-foreground">Grade: {cert.grade}</p>}
                    <p>{new Date(cert.issuedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-6 py-4 border-t border-border">
            <Link href="/student/certificates" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              View all certificates <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Recommended Certifications */}
      <div>
        <h2 className="text-xl font-bold mb-4">Explore Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allCertifications.map(cert => {
            const trans = cert.translations.find(t => t.locale === locale)
              || cert.translations.find(t => t.locale === 'en');
            const isEnrolled = enrollments.some(e => e.certificationId === cert.id);
            return (
              <div key={cert.id} className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {cert.level}
                  </span>
                  <h3 className="text-base font-bold mt-3 mb-2 line-clamp-2">{trans?.title || cert.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {trans?.description || cert.description}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                  <span className="font-bold text-sm">${cert.price.toFixed(2)}</span>
                  {isEnrolled ? (
                    <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Enrolled
                    </span>
                  ) : (
                    <EnrollButton certificationId={cert.id} locale={locale} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center">
          <Link href="/certifications" className={buttonVariants({ variant: 'outline', className: 'gap-2' })}>
            View All Certifications <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Client component for enrollment button
function EnrollButton({ certificationId, locale }: { certificationId: string; locale: string }) {
  return (
    <a
      href={`/${locale}/student/checkout/${certificationId}`}
      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
    >
      Enroll <ArrowRight className="h-3 w-3" />
    </a>
  );
}
