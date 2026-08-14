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
    <div className="flex flex-col flex-1 w-full bg-transparent relative">
      {/* Hero */}
      <section className="relative z-10 container mx-auto px-4 sm:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground pb-2">
            About ESTQB Ethiopia
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            The official representative board of the International Software Testing Qualifications Board (ESTQB) in Ethiopia.
          </p>
        </div>
      </section>

      {/* Mission & Global Recognition */}
      <section className="relative z-10 container mx-auto px-4 sm:px-8 py-16 bg-card/80 backdrop-blur-2xl border border-foreground/15 rounded-3xl shadow-sm mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 shadow-sm group hover:shadow-md hover:border-primary/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              To promote the value of software testing as a profession and to provide a standardized, globally recognized certification framework for software testers in Ethiopia. We aim to elevate the quality of software engineering nationwide.
            </p>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 shadow-sm group hover:shadow-md hover:border-primary/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Global Recognition</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              ESTQB certifications are internationally recognized. By achieving certification through the Ethiopian board, your credentials are valid and respected by employers worldwide, opening doors to global opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Collaborating Globally */}
      <section className="relative z-10 container mx-auto px-4 sm:px-8 py-16 bg-card/80 backdrop-blur-2xl border border-foreground/15 rounded-3xl shadow-sm mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Collaborating Globally</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By connecting local testing talent with global syllabi, exams, and certifications, ESTQB ensures that Ethiopian tech firms can deliver world-class quality assurance. We operate strict non-profit standards to make professional learning accessible.
          </p>
        </div>
      </section>
    </div>
  );
}
