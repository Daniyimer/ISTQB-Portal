import { setRequestLocale } from 'next-intl/server';
import { auth } from '@/auth';

export default async function AdminDashboardPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-muted-foreground mb-2">Total Candidates</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-muted-foreground mb-2">Active Enrollments</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-muted-foreground mb-2">Certificates Issued</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-muted-foreground mb-2">Blog Posts</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Enrollments</h2>
          <div className="bg-card border rounded-xl p-6 shadow-sm text-center text-muted-foreground">
            <p>No recent enrollments.</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Pending Certificates</h2>
          <div className="bg-card border rounded-xl p-6 shadow-sm text-center text-muted-foreground">
            <p>All candidates have been graded and issued certificates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
