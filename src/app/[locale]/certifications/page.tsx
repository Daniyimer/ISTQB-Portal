import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

export default async function CertificationsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('HomePage'); // We can reuse or create new namespace

  return (
    <div className="container mx-auto px-4 py-24 sm:px-8">
      <h1 className="text-4xl font-bold mb-8">Our Certifications</h1>
      <p className="text-muted-foreground max-w-2xl text-lg mb-12">
        Explore our globally recognized software testing certifications. We offer a structured path from Foundation to Advanced levels.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder cards */}
        {[
          { title: "CTFL - Foundation Level", level: "Foundation" },
          { title: "Agile Tester", level: "Foundation Extension" },
          { title: "Test Analyst", level: "Advanced" }
        ].map((cert) => (
          <div key={cert.title} className="border border-border/50 bg-card rounded-xl p-6 shadow-sm flex flex-col hover:border-primary/50 transition-colors">
            <span className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">{cert.level}</span>
            <h3 className="text-xl font-bold mb-4">{cert.title}</h3>
            <p className="text-muted-foreground text-sm mb-6 flex-1">
              Validate your software testing skills and join a global community of certified professionals.
            </p>
            <Link href={`/certifications/${cert.title.toLowerCase().replace(/\s+/g, '-')}`} className={buttonVariants({ variant: 'outline', className: 'w-full' })}>
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
