'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle2, Loader2, QrCode } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

interface CheckoutClientProps {
  certificationId: string;
  price: number;
}

export function CheckoutClient({ certificationId, price }: CheckoutClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    
    try {
      const formData = new FormData();
      formData.append('certificationId', certificationId);
      if (file) {
        formData.append('paymentScreenshot', file);
      }

      const res = await fetch('/api/enrollments', {
        method: 'POST',
        body: formData, // fetch will automatically set the correct Content-Type for FormData
      });

      if (res.ok) {
        setState('done');
        setTimeout(() => {
          window.location.href = '/en/student/dashboard';
        }, 2000);
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 shadow-sm">
      
      {state === 'done' ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
          <p className="text-muted-foreground">Your payment is being verified by the admin. You will gain access soon.</p>
          <p className="text-sm mt-4">Redirecting to dashboard...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-4">Payment Instructions</h2>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3"><span className="font-bold text-foreground">1.</span> Scan the QR code or send payment to our designated account.</li>
                <li className="flex gap-3"><span className="font-bold text-foreground">2.</span> Transfer the exact amount of <span className="font-bold text-foreground">${price.toFixed(2)}</span>.</li>
                <li className="flex gap-3"><span className="font-bold text-foreground">3.</span> Take a screenshot of the successful transaction.</li>
                <li className="flex gap-3"><span className="font-bold text-foreground">4.</span> Upload the screenshot below and request access.</li>
              </ul>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col items-center justify-center text-center w-full md:w-64">
              <QrCode className="w-32 h-32 text-primary opacity-50 mb-3" />
              <p className="font-semibold text-sm">Scan to Pay</p>
              <p className="text-xs text-muted-foreground mt-1">Acct: 123456789</p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <label className="block text-sm font-medium mb-3">Upload Payment Screenshot</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 border-2 border-dashed border-input rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/10 transition-colors">
                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground font-medium">
                  {file ? file.name : "Click to select image"}
                </span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          {state === 'error' && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
              Failed to submit request. Please try again.
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={state === 'loading' || !file}
              className={buttonVariants({ size: 'lg', className: 'gap-2 w-full md:w-auto' })}
            >
              {state === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
              {state === 'loading' ? 'Submitting...' : 'Confirm Payment & Request Access'}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
