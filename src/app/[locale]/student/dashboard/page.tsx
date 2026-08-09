import { setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';

export default async function StudentDashboardPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Welcome, {session?.user?.name || 'Student'}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-muted-foreground mb-2">Active Enrollments</h3>
          <p className="text-3xl font-bold">1</p>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-muted-foreground mb-2">Completed Courses</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-muted-foreground mb-2">Certificates Earned</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-6">My Enrollments</h2>
      <div className="bg-card border rounded-xl p-8 shadow-sm text-center text-muted-foreground">
        <p>No active enrollments found.</p>
        <p className="text-sm mt-2">Browse the catalog to find a certification that fits your goals.</p>
      </div>
    </div>
  );
}
