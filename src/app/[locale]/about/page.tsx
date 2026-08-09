import { setRequestLocale } from 'next-intl/server';

export default async function AboutPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-24 sm:px-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">About ESTQB Ethiopia</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="lead text-xl text-muted-foreground mb-8 text-center">
          We are the official representative of the International Software Testing Qualifications Board (ESTQB) in Ethiopia.
        </p>
        
        <div className="grid md:grid-cols-2 gap-12 mt-12">
          <div className="bg-card border rounded-xl p-8 shadow-sm">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Our Mission</h3>
            <p className="text-muted-foreground">
              To promote the value of software testing as a profession and to provide a standardized, globally recognized certification framework for software testers in Ethiopia. We aim to elevate the quality of software engineering nationwide.
            </p>
          </div>
          <div className="bg-card border rounded-xl p-8 shadow-sm">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Global Recognition</h3>
            <p className="text-muted-foreground">
              ESTQB certifications are internationally recognized. By achieving certification through the Ethiopian board, your credentials are valid and respected by employers worldwide, opening doors to global opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
