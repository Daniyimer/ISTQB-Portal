import { setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, Award, Mail, Clock, CheckCircle2, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { StaffReplyForm } from '@/components/StaffReplyForm';
import { ApproveEnrollmentButton } from '@/components/ApproveEnrollmentButton';

export default async function StudentDetailPage({
  params
}: {
  params: Promise<{locale: string; id: string}>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const session = await auth();

  const student = await prisma.user.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: {
          certification: { include: { translations: true } }
        },
        orderBy: { enrolledAt: 'desc' },
      },
      certificates: {
        include: {
          certification: { include: { translations: true } }
        },
        orderBy: { issuedAt: 'desc' },
      },
      sentMessages: {
        where: { parentId: null },
        include: {
          certification: { select: { title: true } },
          replies: {
            include: {
              sender: { select: { fullName: true, email: true, role: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!student) notFound();

  const activeEnrollments = student.enrollments.filter(e => e.status !== 'COMPLETED');
  const completedEnrollments = student.enrollments.filter(e => e.status === 'COMPLETED');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/admin/students" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Students
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-extrabold">
            {student.fullName?.charAt(0) || student.email?.charAt(0) || '?'}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{student.fullName || 'Unnamed Student'}</h1>
            <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
              <Mail className="h-4 w-4" /> {student.email}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              student.isVerified ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'
            }`}>
              {student.isVerified ? '✓ Verified' : 'Unverified'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground font-semibold">Active Enrollments</p>
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <p className="text-4xl font-extrabold">{activeEnrollments.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground font-semibold">Completed</p>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-4xl font-extrabold">{completedEnrollments.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground font-semibold">Certificates</p>
            <Award className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-4xl font-extrabold">{student.certificates.length}</p>
        </div>
      </div>

      {/* Enrollment Progress */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> Certification Progress
          </h2>
        </div>
        {student.enrollments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">No enrollments yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {student.enrollments.map(enrollment => {
              const trans = enrollment.certification.translations.find(t => t.locale === locale)
                || enrollment.certification.translations.find(t => t.locale === 'en');
              return (
                <div key={enrollment.id} className="px-6 py-4 flex items-center gap-6">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{trans?.title || enrollment.certification.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        enrollment.status === 'COMPLETED' ? 'bg-green-500/10 text-green-600'
                        : enrollment.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-600'
                        : enrollment.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-600'
                        : 'bg-primary/10 text-primary'
                      }`}>
                        {enrollment.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </span>
                    </div>
                    {enrollment.status === 'PENDING' && enrollment.paymentScreenshot && (
                      <a href={enrollment.paymentScreenshot} target="_blank" rel="noreferrer" className="flex items-center gap-1 mt-2 text-xs font-semibold text-blue-600 hover:underline">
                        <ImageIcon className="h-3.5 w-3.5" /> View Payment Screenshot
                      </a>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    {enrollment.status === 'PENDING' ? (
                      <ApproveEnrollmentButton enrollmentId={enrollment.id} />
                    ) : (
                      <>
                        <p className="text-sm font-bold">{Math.round(enrollment.progressPercent)}%</p>
                        <div className="w-32 h-1.5 bg-muted rounded-full mt-1">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${enrollment.progressPercent}%` }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certificates */}
      {student.certificates.length > 0 && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" /> Issued Certificates
            </h2>
          </div>
          <div className="divide-y divide-border">
            {student.certificates.map(cert => {
              const trans = cert.certification.translations.find(t => t.locale === locale)
                || cert.certification.translations.find(t => t.locale === 'en');
              return (
                <div key={cert.id} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm">{trans?.title || cert.certification.title}</p>
                    <p className="text-xs text-muted-foreground font-mono">{cert.certificateNumber}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    {cert.grade && <p className="font-bold text-foreground">Grade: {cert.grade}</p>}
                    <p>{new Date(cert.issuedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Q&A Messages */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-500" /> Q&A Messages
          </h2>
        </div>
        {student.sentMessages.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">No messages from this student yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {student.sentMessages.map(msg => (
              <div key={msg.id} className="px-6 py-4 space-y-3">
                <div>
                  <p className="font-semibold text-sm">{msg.subject}</p>
                  {msg.certification && (
                    <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {msg.certification.title}
                    </span>
                  )}
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{msg.body}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                </div>
                {/* Replies */}
                {msg.replies.length > 0 && (
                  <div className="ml-6 space-y-2 border-l-2 border-primary/20 pl-4">
                    {msg.replies.map(reply => (
                      <div key={reply.id} className="bg-primary/5 rounded-lg p-3">
                        <p className="text-xs font-bold text-primary mb-1">
                          {reply.sender.fullName || reply.sender.email} · {reply.sender.role}
                        </p>
                        <p className="text-sm leading-relaxed">{reply.body}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{new Date(reply.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
                {/* Staff Reply Form */}
                <StaffReplyForm parentId={msg.id} studentId={student.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
