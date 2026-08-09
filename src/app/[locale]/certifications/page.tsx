import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { prisma } from '@/lib/prisma';
import { Award, BookOpen, Clock, Tag, Percent } from 'lucide-react';

export default async function CertificationsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const certifications = await prisma.certification.findMany({
    include: { translations: true }
  });

  return (
    <div className="container mx-auto px-4 py-20 sm:px-8 max-w-7xl">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground pb-2">
          ESTQB Certifications
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Unlock new career milestones with our globally recognized testing syllabi. Access materials and register for examinations in Ethiopia.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certifications.map((cert) => {
          const trans = cert.translations.find(tr => tr.locale === locale) || cert.translations.find(tr => tr.locale === 'en') || cert;
          return (
            <div key={cert.id} className="bg-card border border-border/40 rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
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
              
              <div className="pt-6 border-t border-border/40 flex justify-between items-center">
                <div className="flex items-center gap-1 text-lg font-bold text-foreground">
                  <Tag className="h-4 w-4 text-primary/60" />
                  <span>${cert.price.toFixed(2)}</span>
                </div>
                <Link 
                  href={`/certifications`} 
                  className={buttonVariants({ variant: 'outline', className: 'hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold' })}
                >
                  View Syllabus
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      {certifications.length === 0 && (
        <div className="text-center p-12 bg-card border border-border/40 rounded-2xl text-muted-foreground">
          No certifications registered in database.
        </div>
      )}
    </div>
  );
}
