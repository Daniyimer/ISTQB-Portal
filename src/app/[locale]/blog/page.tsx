import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function BlogPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-24 sm:px-8">
      <h1 className="text-4xl font-bold mb-8">Latest News & Articles</h1>
      <p className="text-muted-foreground max-w-2xl text-lg mb-12">
        Stay up to date with the latest software testing trends, announcements, and study resources from ESTQB Ethiopia.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <article key={i} className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
              <time dateTime="2023-10-12">October 12, 2026</time>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Announcement</span>
            </div>
            <h2 className="mb-3 text-2xl font-bold group-hover:text-primary transition-colors">
              <Link href={`/blog/sample-post-${i}`}>
                Sample Blog Post Title {i}
              </Link>
            </h2>
            <p className="text-muted-foreground mb-6 line-clamp-3">
              This is a placeholder for the blog post excerpt. In the future, this will be populated dynamically from the PostgreSQL database using Prisma, allowing admins to publish rich content directly from the dashboard.
            </p>
            <div className="flex items-center text-sm font-medium text-primary">
              Read more &rarr;
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
