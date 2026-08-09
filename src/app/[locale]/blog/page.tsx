import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { prisma } from '@/lib/prisma';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default async function BlogPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await prisma.blogPost.findMany({
    include: { translations: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container mx-auto px-4 py-20 sm:px-8 max-w-7xl">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground pb-2">
          ESTQB Newsroom
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Stay up to date with the latest software testing methodologies, official board announcements, and helpful study tips.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
          const trans = post.translations.find(tr => tr.locale === locale) || post.translations.find(tr => tr.locale === 'en') || post;
          return (
            <article key={post.id} className="group bg-card border border-border/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div>
                <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
                  <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span>{post.readTimeMinutes} min read</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {trans.title}
                </h3>
                <div className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: trans.body }} />
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-between items-center text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(locale, { dateStyle: 'medium' }) : 'Draft'}
                </span>
                <Link href={`/blog`} className="text-primary font-bold hover:underline flex items-center gap-1 group/link">
                  Read Article
                  <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      {posts.length === 0 && (
        <div className="text-center p-12 bg-card border border-border/40 rounded-2xl text-muted-foreground">
          No articles published yet. Check back later!
        </div>
      )}
    </div>
  );
}
