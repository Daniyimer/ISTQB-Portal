import { setRequestLocale } from 'next-intl/server';
import { buttonVariants } from '@/components/ui/button';

export default async function VerifyCertificatePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-24 sm:px-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Verify a Certificate</h1>
        <p className="text-muted-foreground text-lg">
          Enter the certificate number to verify its authenticity and view the digital copy.
        </p>
      </div>
      
      <div className="bg-card border rounded-xl p-8 shadow-sm">
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="certificateNumber">Certificate Number</label>
            <div className="flex gap-4">
              <input 
                id="certificateNumber" 
                className="flex h-10 w-full flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                placeholder="e.g. ESTQB-ET-12345" 
              />
              <button type="button" className={buttonVariants()}>
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
