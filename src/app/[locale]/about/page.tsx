import { setRequestLocale } from 'next-intl/server';
import { Award, Globe, Shield, Users } from 'lucide-react';

export default async function AboutPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-20 sm:px-8 max-w-5xl">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground pb-2">
          About ESTQB Ethiopia
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          The official representative board of the International Software Testing Qualifications Board (ESTQB) in Ethiopia.
        </p>
      </div>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card border border-border/40 rounded-2xl p-8 shadow-sm group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              To promote the value of software testing as a profession and to provide a standardized, globally recognized certification framework for software testers in Ethiopia. We aim to elevate the quality of software engineering nationwide.
            </p>
          </div>
          <div className="bg-card border border-border/40 rounded-2xl p-8 shadow-sm group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Global Recognition</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              ESTQB certifications are internationally recognized. By achieving certification through the Ethiopian board, your credentials are valid and respected by employers worldwide, opening doors to global opportunities.
            </p>
          </div>
        </div>

        <div className="bg-muted/30 border border-border/30 rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Collaborating Globally</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By connecting local testing talent with global syllabi, exams, and certifications, ESTQB ensures that Ethiopian tech firms can deliver world-class quality assurance. We operate strict non-profit standards to make professional learning accessible.
          </p>
        </div>
      </div>
    </div>
  );
}
