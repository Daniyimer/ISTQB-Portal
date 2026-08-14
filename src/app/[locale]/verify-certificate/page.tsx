import { setRequestLocale } from 'next-intl/server';
import { buttonVariants } from '@/components/ui/button';
import { ShieldCheck, Search } from 'lucide-react';

export default async function VerifyCertificatePage({
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
          <div className="inline-flex w-16 h-16 rounded-full bg-primary/10 items-center justify-center text-primary mb-2 shadow-inner">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground pb-2">
            Verify Certificate
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Enter the certificate number to instantly verify its authenticity and view the verified credentials.
          </p>
        </div>
      </section>

      {/* Verification Form */}
      <section className="relative z-10 container mx-auto px-4 sm:px-8 py-16 bg-card/80 backdrop-blur-2xl border border-foreground/15 rounded-3xl shadow-sm mb-16 max-w-2xl">
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 shadow-sm">
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="certificateNumber">Certificate Number</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  id="certificateNumber" 
                  className="flex h-10 w-full flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                  placeholder="e.g. ESTQB-ET-12345" 
                />
                <button type="button" className={buttonVariants({ className: 'gap-1.5 font-semibold' })}>
                  <Search className="h-4 w-4" />
                  Verify
                </button>
              </div>
            </div>
          </form>
          
          {/* Placeholder for verification result */}
          <div className="mt-8 p-6 bg-background/50 rounded-lg text-center text-muted-foreground hidden">
            Enter a number above to see the result.
          </div>
        </div>
      </section>
    </div>
  );
}
