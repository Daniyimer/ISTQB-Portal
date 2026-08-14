import { setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/routing';
import { Users, Search, BookOpen, Award, ChevronRight } from 'lucide-react';

export default async function AdminStudentsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await auth();

  const students = await prisma.user.findMany({
    where: { role: 'CANDIDATE' },
    include: {
      enrollments: {
        include: {
          certification: {
            include: { translations: true }
          }
        }
      },
      certificates: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground mt-1">{students.length} registered student{students.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-muted-foreground">Total Students</p>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="text-4xl font-extrabold">{students.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-muted-foreground">Total Enrollments</p>
            <BookOpen className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-4xl font-extrabold">
            {students.reduce((acc, s) => acc + s.enrollments.length, 0)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-muted-foreground">Certificates Issued</p>
            <Award className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-4xl font-extrabold">
            {students.reduce((acc, s) => acc + s.certificates.length, 0)}
          </p>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-bold text-lg">All Students</h2>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-semibold">No students registered yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Student</th>
                  <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Enrollments</th>
                  <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Avg Progress</th>
                  <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Certificates</th>
                  <th className="text-left px-6 py-3 font-semibold text-muted-foreground">Joined</th>
                  <th className="text-left px-6 py-3 font-semibold text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map(student => {
                  const avgProgress = student.enrollments.length > 0
                    ? student.enrollments.reduce((acc, e) => acc + e.progressPercent, 0) / student.enrollments.length
                    : 0;
                  return (
                    <tr key={student.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                            {student.fullName?.charAt(0) || student.email?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-semibold">{student.fullName || '—'}</p>
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                          {student.enrollments.length}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-muted rounded-full">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${Math.round(avgProgress)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{Math.round(avgProgress)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-yellow-500/10 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          {student.certificates.length}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/students/${student.id}`}
                          className="flex items-center gap-1 text-primary text-xs font-semibold hover:underline"
                        >
                          View <ChevronRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
