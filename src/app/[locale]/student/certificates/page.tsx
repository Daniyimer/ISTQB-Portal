import { setRequestLocale } from 'next-intl/server';

export default async function StudentCertificatesPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Certificates</h1>
      
      <div className="bg-card border rounded-xl p-8 shadow-sm text-center text-muted-foreground">
        <p>You haven't earned any certificates yet.</p>
        <p className="text-sm mt-2">Complete an exam to see your certificates here.</p>
      </div>
    </div>
  );
}
