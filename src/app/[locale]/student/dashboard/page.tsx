import { setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/routing';
import { Award, BookOpen, CheckCircle2, Clock, ArrowRight, Compass, PlayCircle, Zap } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { EnrollButton } from '@/components/EnrollButton';
import { DashboardTabs } from '@/components/student/DashboardTabs';

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
      take: 4,
    }),
  ]);

  const activeEnrollments = enrollments.filter(e => e.status === 'ACTIVE' || e.status === 'IN_PROGRESS' || e.status === 'PENDING');
  const completedEnrollments = enrollments.filter(e => e.status === 'COMPLETED');
  const inProgressEnrollment = activeEnrollments.find(e => e.status === 'IN_PROGRESS' || e.status === 'ACTIVE');

  const stats = [
    { label: 'Active Courses', value: activeEnrollments.length, icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Completed', value: completedEnrollments.length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-500/10' },
    { label: 'Certificates Earned', value: certificates.length, icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      
      {/* 1. Dynamic Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-blue-500/5 border border-border rounded-3xl p-8 sm:p-12 shadow-sm">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 text-primary/5">
          <Zap className="w-96 h-96" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Welcome back, <span className="text-primary">{session?.user?.name?.split(' ')[0] || 'Student'}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ready to take the next step in your software testing career? Resume your progress or explore new certifications to elevate your skills.
            </p>
          </div>
          {inProgressEnrollment ? (
            <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-xl shrink-0 w-full md:w-80 transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Continue Learning</span>
              </div>
              <h3 className="font-bold text-lg mb-4 line-clamp-2">
                {inProgressEnrollment.certification.translations.find(t => t.locale === locale)?.title || inProgressEnrollment.certification.title}
              </h3>
              <div className="mb-5">
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span>Progress</span>
                  <span className="text-primary">{Math.round(inProgressEnrollment.progressPercent)}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${inProgressEnrollment.progressPercent}%` }} />
                </div>
              </div>
              <Link
                href={`/student/learn/${inProgressEnrollment.id}`}
                className={buttonVariants({ className: 'w-full gap-2 shadow-md' })}
              >
                Resume Course <PlayCircle className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-xl shrink-0 w-full md:w-80 text-center transition-transform hover:-translate-y-1 duration-300">
               <Compass className="h-10 w-10 text-primary mx-auto mb-3 opacity-80" />
               <h3 className="font-bold text-lg mb-2">Start a New Journey</h3>
               <p className="text-sm text-muted-foreground mb-4">You have no active courses right now.</p>
               <Link href="/certifications" className={buttonVariants({ variant: 'default', className: 'w-full shadow-md' })}>
                 Explore Catalog
               </Link>
            </div>
          )}
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card border border-border/60 hover:border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{label}</h3>
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color} transition-transform group-hover:scale-110`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-4xl font-extrabold tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* 3. Main Dashboard Tabs */}
      <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden p-6 sm:p-8">
        <DashboardTabs
          tabs={[
            { id: 'enrollments', label: 'My Enrollments', icon: <BookOpen className="h-4 w-4" /> },
            { id: 'certificates', label: 'My Certificates', icon: <Award className="h-4 w-4" /> },
            { id: 'explore', label: 'Explore Courses', icon: <Compass className="h-4 w-4" /> },
          ]}
        >
          
          {/* TAB 1: ENROLLMENTS */}
          <div className="pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {enrollments.length === 0 ? (
              <div className="text-center py-16 px-4 bg-muted/20 rounded-2xl border border-dashed border-border">
                <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-border/50">
                  <BookOpen className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold mb-2">Your learning journey awaits</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">You haven't enrolled in any certifications yet. Explore our world-class curriculum to get started.</p>
                <Link href="/certifications" className={buttonVariants({ variant: 'default', size: 'lg', className: 'rounded-full' })}>
                  Browse Catalog <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {enrollments.map(enrollment => {
                  const trans = enrollment.certification.translations.find(t => t.locale === locale) 
                    || enrollment.certification.translations.find(t => t.locale === 'en');
                  const isPending = enrollment.status === 'PENDING';
                  return (
                    <div key={enrollment.id} className="group relative bg-background border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            enrollment.status === 'COMPLETED' ? 'bg-green-500/10 text-green-600'
                              : isPending ? 'bg-yellow-500/10 text-yellow-600'
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {enrollment.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
                            <Clock className="h-3 w-3" />
                            {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {trans?.title || enrollment.certification.title}
                        </h3>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-border/60">
                        {isPending ? (
                          <div className="bg-yellow-500/5 rounded-xl p-4 border border-yellow-500/10 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-yellow-600">Pending Verification</p>
                              <p className="text-xs text-muted-foreground mt-0.5">Admin will approve soon</p>
                            </div>
                            <Clock className="h-5 w-5 text-yellow-500/50" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-6">
                            <div className="flex-1">
                              <div className="flex justify-between text-xs font-bold mb-1.5">
                                <span className="text-muted-foreground">Progress</span>
                                <span>{Math.round(enrollment.progressPercent)}%</span>
                              </div>
                              <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                                <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${enrollment.progressPercent}%` }} />
                              </div>
                            </div>
                            <Link
                              href={`/student/learn/${enrollment.id}`}
                              className={buttonVariants({ variant: enrollment.progressPercent > 0 ? 'default' : 'outline', className: 'shrink-0 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all' })}
                            >
                              {enrollment.progressPercent > 0 ? 'Resume' : 'Start'} <PlayCircle className="ml-2 h-4 w-4" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* TAB 2: CERTIFICATES */}
          <div className="pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {certificates.length === 0 ? (
              <div className="text-center py-16 px-4 bg-muted/20 rounded-2xl border border-dashed border-border">
                <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-border/50">
                  <Award className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold mb-2">No certificates yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">Complete a certification course and pass the final exam to earn your industry-recognized certificate.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map(cert => {
                  const trans = cert.certification.translations.find(t => t.locale === locale)
                    || cert.certification.translations.find(t => t.locale === 'en');
                  return (
                    <div key={cert.id} className="relative group bg-gradient-to-b from-background to-muted/20 border border-border hover:border-yellow-500/50 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all text-center flex flex-col items-center">
                      <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
                      <div className="w-16 h-16 bg-yellow-500/10 text-yellow-600 rounded-2xl flex items-center justify-center mb-4 ring-4 ring-background shadow-sm">
                        <Award className="h-8 w-8" />
                      </div>
                      <h3 className="font-bold text-lg mb-1 leading-tight">{trans?.title || cert.certification.title}</h3>
                      <p className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded mt-2 mb-4">ID: {cert.certificateNumber}</p>
                      
                      <div className="w-full flex justify-between text-xs font-semibold text-muted-foreground pt-4 border-t border-border">
                        <span>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</span>
                        {cert.grade && <span className="text-foreground">Grade: {cert.grade}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* TAB 3: EXPLORE */}
          <div className="pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allCertifications.map(cert => {
                const trans = cert.translations.find(t => t.locale === locale)
                  || cert.translations.find(t => t.locale === 'en');
                const isEnrolled = enrollments.some(e => e.certificationId === cert.id);
                return (
                  <div key={cert.id} className="bg-background border border-border hover:border-primary/40 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md">
                          {cert.level}
                        </span>
                      </div>
                      <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{trans?.title || cert.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {trans?.description || cert.description}
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-border/60 flex justify-between items-center">
                      <span className="font-extrabold text-sm">${cert.price.toFixed(2)}</span>
                      {isEnrolled ? (
                        <span className="text-[10px] font-bold text-green-600 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Enrolled
                        </span>
                      ) : (
                        <EnrollButton certificationId={cert.id} locale={locale} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Link href="/certifications" className={buttonVariants({ variant: 'outline', className: 'rounded-full px-8' })}>
                View Full Catalog
              </Link>
            </div>
          </div>

        </DashboardTabs>
      </div>

    </div>
  );
}
