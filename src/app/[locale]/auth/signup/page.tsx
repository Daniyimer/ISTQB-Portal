import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { SignUpForm } from '@/components/auth/SignUpForm';

export default async function SignUpPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-border/40 bg-card rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground text-sm">Register as a new candidate</p>
        </div>
        
        <SignUpForm locale={locale} />
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-primary hover:underline font-medium">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
