import { setRequestLocale } from 'next-intl/server';
import { SignInForm } from '@/components/auth/SignInForm';

export default async function SuperAdminLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<{callbackUrl?: string}>;
}) {
  const { locale } = await params;
  const { callbackUrl } = await searchParams;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-16rem)] items-center justify-center px-4">
      <div className="w-full max-w-md border-t-4 border-t-destructive border-x-border/40 border-b-border/40 bg-card rounded-2xl p-8 shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Super Admin Portal</h1>
          <p className="text-muted-foreground text-sm">Restricted access area</p>
        </div>
        
        <SignInForm locale={locale} callbackUrl={callbackUrl || `/${locale}/superadmin/dashboard`} />
        
      </div>
    </div>
  );
}
