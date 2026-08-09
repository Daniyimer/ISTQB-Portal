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
    <div className="container mx-auto px-4 py-20 sm:px-8 max-w-2xl">
      <div className="text-center mb-12 space-y-4">
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
      
      <div className="bg-card border border-border/40 rounded-2xl p-8 shadow-sm">
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
        <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center text-muted-foreground hidden">
          Enter a number above to see the result.
        </div>
      </div>
    </div>
  );
}
