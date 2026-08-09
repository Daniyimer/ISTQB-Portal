import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { SignInForm } from '@/components/auth/SignInForm';

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{callbackUrl?: string, success?: string}>;
}) {
  const { locale } = await params;
  const { callbackUrl, success } = await searchParams;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-16rem)] items-center justify-center px-4">
      <div className="w-full max-w-md border border-border/40 bg-card rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">Sign in to your candidate or admin account</p>
        </div>
        
        {success === 'registered' && (
          <div className="mb-4 p-3 bg-green-500/10 text-green-600 rounded-md text-sm text-center">
            Account created successfully. Please sign in.
          </div>
        )}
        
        <SignInForm locale={locale} callbackUrl={callbackUrl} />
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-primary hover:underline font-medium">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
