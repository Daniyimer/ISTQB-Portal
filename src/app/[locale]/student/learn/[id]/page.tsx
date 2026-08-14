import { setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { ArrowLeft, BookOpen, Download } from 'lucide-react';
import { LearningHubClient } from '@/components/LearningHubClient';

export default async function StudentLearnPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id: enrollmentId } = await params;
  setRequestLocale(locale);
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      certification: {
        include: {
          translations: true,
          syllabusFiles: true,
        }
      }
    }
  });

  if (!enrollment || enrollment.userId !== session.user.id) {
    notFound();
  }

  const cert = enrollment.certification;
  const trans = cert.translations.find(t => t.locale === locale) || cert.translations.find(t => t.locale === 'en');

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <Link href="/student/dashboard" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
            <BookOpen className="h-8 w-8" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-3 inline-block">
              {cert.level}
            </span>
            <h1 className="text-3xl font-extrabold">{trans?.title || cert.title}</h1>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed max-w-3xl">
              {trans?.description || cert.description}
            </p>
          </div>
        </div>
      </div>

      <LearningHubClient 
        enrollmentId={enrollment.id} 
        initialProgress={enrollment.progressPercent}
        certificationId={cert.id}
      />
      
      {/* Study Materials */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/20">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-500" /> Study Materials & Syllabus
          </h2>
        </div>
        {cert.syllabusFiles.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No materials have been uploaded for this course yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {cert.syllabusFiles.map(file => (
              <div key={file.id} className="p-6 flex items-center justify-between hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{file.fileName}</p>
                    <p className="text-xs text-muted-foreground">{(file.fileSizeKb / 1024).toFixed(1)} MB · PDF</p>
                  </div>
                </div>
                <a 
                  href={file.fileUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Download <Download className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
