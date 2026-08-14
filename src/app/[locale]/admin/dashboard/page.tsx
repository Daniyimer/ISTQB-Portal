import { setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Users, BookOpen, Award, FileText, TrendingUp, Clock } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default async function AdminDashboardPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();

  // Fetch live stats in parallel
  const [
    totalCandidates,
    activeEnrollments,
    certificatesIssued,
    totalBlogPosts,
    recentEnrollments,
    pendingEnrollments,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'CANDIDATE' } }),
    prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
    prisma.certificate.count(),
    prisma.blogPost.count(),
    prisma.enrollment.findMany({
      take: 5,
      orderBy: { enrolledAt: 'desc' },
      include: {
        user: { select: { fullName: true, email: true } },
        certification: { select: { title: true, level: true } },
      },
    }),
    prisma.enrollment.findMany({
      where: { status: 'ACTIVE' },
      take: 5,
      orderBy: { enrolledAt: 'desc' },
      include: {
        user: { select: { fullName: true, email: true } },
        certification: { select: { title: true } },
      },
    }),
  ]);

  const stats = [
    { label: 'Total Candidates', value: totalCandidates, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active Enrollments', value: activeEnrollments, icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Certificates Issued', value: certificatesIssued, icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Blog Posts', value: totalBlogPosts, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {session?.user?.name || 'Admin'}.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Enrollments */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Recent Enrollments
            </h2>
            <span className="text-xs text-muted-foreground">{recentEnrollments.length} latest</span>
          </div>
          <div className="divide-y divide-border">
            {recentEnrollments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">No enrollments yet.</p>
            ) : recentEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{enrollment.user.fullName || enrollment.user.email}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{enrollment.certification.title}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    enrollment.status === 'COMPLETED' 
                      ? 'bg-green-500/10 text-green-600' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {enrollment.status}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Certifications (candidates needing action) */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" /> Active Candidates
            </h2>
            <Link href="/admin/certificates" className="text-xs text-primary font-semibold hover:underline">
              Issue Certificate →
            </Link>
          </div>
          <div className="divide-y divide-border">
            {pendingEnrollments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">All certificates have been issued.</p>
            ) : pendingEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{enrollment.user.fullName || enrollment.user.email}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{enrollment.certification.title}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
