import { prisma } from '@/lib/prisma';
import { SyllabusUploadForm } from '@/components/admin/SyllabusUploadForm';
import { DeleteSyllabusButton } from '@/components/admin/DeleteSyllabusButton';
import { setRequestLocale } from 'next-intl/server';
import { BookOpen } from 'lucide-react';

export default async function ManageSyllabusPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch all certifications for the dropdown
  const certifications = await prisma.certification.findMany({
    include: { translations: true },
    orderBy: { createdAt: 'desc' }
  });

  // Fetch all existing syllabus files to display in the list
  const syllabusFiles = await prisma.syllabusFile.findMany({
    include: { 
      certification: {
        include: { translations: true }
      }
    },
    orderBy: { uploadedAt: 'desc' }
  });

  // Map certifications to options (using correct translation)
  const certOptions = certifications.map(cert => {
    const trans = cert.translations.find(t => t.locale === locale) || cert.translations.find(t => t.locale === 'en');
    return {
      id: cert.id,
      title: trans?.title || cert.title
    };
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Syllabus Files</h1>
      
      <div className="bg-card border rounded-2xl p-8 shadow-sm max-w-2xl mb-12">
        <h2 className="text-xl font-semibold mb-6">Upload New Syllabus</h2>
        <SyllabusUploadForm certifications={certOptions} />
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Current Files</h2>
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        {syllabusFiles.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No syllabus files uploaded yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {syllabusFiles.map(file => {
              const trans = file.certification.translations.find(t => t.locale === locale) || file.certification.translations.find(t => t.locale === 'en');
              return (
                <div key={file.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold">{file.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        For: <span className="font-semibold text-foreground">{trans?.title || file.certification.title}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{new Date(file.uploadedAt).toLocaleDateString()}</p>
                      <p className="text-xs font-mono bg-muted px-2 py-0.5 rounded mt-1">{(file.fileSizeKb / 1024).toFixed(2)} MB</p>
                    </div>
                    <DeleteSyllabusButton id={file.id} fileName={file.fileName} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
