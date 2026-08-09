import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { 
  Award, 
  BookOpen, 
  Briefcase, 
  Calendar, 
  ArrowRight, 
  Globe, 
  Users, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('HomePage');

  // Fetch actual data
  const certifications = await prisma.certification.findMany({
    include: { translations: true },
    take: 3
  });

  const blogPosts = await prisma.blogPost.findMany({
    include: { translations: true },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex flex-col flex-1 w-full bg-transparent relative">
      {/* 1. Hero Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-8 pt-20 pb-16 md:pt-32 md:pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground pb-2 leading-[1.1]">
            {t('title')}
          </h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-lg">
            {t('description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/certifications" className={buttonVariants({ size: 'lg', className: 'w-full sm:w-auto shadow-lg shadow-primary/20 gap-2 font-semibold' })}>
              {t('explore')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/about" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'w-full sm:w-auto backdrop-blur-sm bg-background/50 font-semibold' })}>
              {t('learnAbout')}
            </Link>
          </div>
        </div>
        <div className="relative hidden md:block">
          {/* Floating Certificate Graphic (Glassmorphism) */}
          <div className="relative w-full max-w-md mx-auto aspect-[4/3] bg-card/30 backdrop-blur-2xl border border-foreground/15 rounded-2xl p-6 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
             <div className="flex justify-between items-start mb-8">
               <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary"><Award className="h-6 w-6" /></div>
               <div className="w-24 h-6 rounded bg-muted/50"></div>
             </div>
             <div className="space-y-4 mb-8">
               <div className="w-3/4 h-4 rounded bg-muted/50"></div>
               <div className="w-1/2 h-4 rounded bg-muted/50"></div>
             </div>
             <div className="pt-6 border-t border-border/40 flex justify-between">
               <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center opacity-50"><CheckCircle2 className="h-8 w-8 text-primary" /></div>
               <div className="w-32 h-12 rounded bg-muted/30"></div>
             </div>
          </div>
        </div>
      </section>

      {/* 1.5 Who We Are Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-8 py-16 md:py-24 bg-card/80 backdrop-blur-2xl border border-foreground/15 rounded-3xl shadow-sm mb-16">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">{t('whoWeAreTitle')}</h2>
            <p className="text-xl font-medium text-foreground/80">{t('whoWeAreSub')}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 text-left rounded-3xl p-8 md:p-12">
            <p className="text-muted-foreground leading-relaxed">{t('whoWeAreDesc1')}</p>
            <p className="text-muted-foreground leading-relaxed">{t('whoWeAreDesc2')}</p>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-8 py-12 bg-card/80 backdrop-blur-2xl border border-foreground/15 rounded-3xl shadow-sm mb-16">
        <h2 className="sr-only">{t('statsTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="flex justify-center text-primary"><Globe className="h-8 w-8" /></div>
            <p className="text-4xl font-extrabold tracking-tight text-foreground">130+</p>
            <p className="font-semibold text-foreground/95">{t('statCountries')}</p>
            <p className="text-xs text-muted-foreground">{t('statCountriesDesc')}</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center text-primary"><Users className="h-8 w-8" /></div>
            <p className="text-4xl font-extrabold tracking-tight text-foreground">1,000+</p>
            <p className="font-semibold text-foreground/95">{t('statCertified')}</p>
            <p className="text-xs text-muted-foreground">{t('statCertifiedDesc')}</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center text-primary"><CheckCircle2 className="h-8 w-8" /></div>
            <p className="text-4xl font-extrabold tracking-tight text-foreground">50+</p>
            <p className="font-semibold text-foreground/95">{t('statExams')}</p>
            <p className="text-xs text-muted-foreground">{t('statExamsDesc')}</p>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Section (Bento Box) */}
      <section className="relative z-10 container mx-auto px-4 sm:px-8 py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('whyChooseTitle')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('whyChooseSub')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Main featured card */}
          <div className="bg-card/30 backdrop-blur-2xl border border-foreground/15 rounded-3xl p-8 hover:shadow-xl hover:border-foreground/25 transition-all duration-300 group flex flex-col justify-center shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Globe className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{t('val1Title')}</h3>
            <p className="text-muted-foreground leading-relaxed">{t('val1Desc')}</p>
          </div>
          {/* Stacked right cards */}
          <div className="flex flex-col gap-8">
            <div className="bg-card/30 backdrop-blur-2xl border border-foreground/15 rounded-3xl p-8 hover:shadow-xl hover:border-foreground/25 transition-all duration-300 group flex-1 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('val2Title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('val2Desc')}</p>
            </div>
            <div className="bg-card/30 backdrop-blur-2xl border border-foreground/15 rounded-3xl p-8 hover:shadow-xl hover:border-foreground/25 transition-all duration-300 group flex-1 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('val3Title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('val3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Active Certifications */}
      <section className="relative z-10 container mx-auto px-4 sm:px-8 py-16 bg-card/80 backdrop-blur-2xl border border-foreground/15 rounded-3xl shadow-sm mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-3">{t('certTitle')}</h2>
            <p className="text-muted-foreground">{t('certSub')}</p>
          </div>
          <Link href="/certifications" className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline group">
            {t('explore')}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {certifications.map(cert => {
            const trans = cert.translations.find(tr => tr.locale === locale) || cert.translations.find(tr => tr.locale === 'en') || cert;
            return (
              <div key={cert.id} className="rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-all">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {cert.level}
                  </span>
                  <h3 className="text-lg font-bold mt-3 mb-2">{trans.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                    {trans.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-border/40 flex justify-between items-center text-xs">
                  <span className="font-semibold text-foreground">${cert.price.toFixed(2)}</span>
                  <Link href={`/certifications`} className="text-primary font-bold hover:underline flex items-center gap-1">
                    Details <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Certification Journey */}
      <section className="relative z-10 container mx-auto px-4 sm:px-8 py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('journeyTitle')}</h2>
          <p className="text-muted-foreground leading-relaxed">{t('journeySub')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 z-0"></div>
          
          <div className="relative z-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto shadow-md">1</div>
            <h4 className="font-bold text-lg">{t('step1')}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed px-4">{t('step1Desc')}</p>
          </div>
          <div className="relative z-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto shadow-md animate-pulse">2</div>
            <h4 className="font-bold text-lg">{t('step2')}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed px-4">{t('step2Desc')}</p>
          </div>
          <div className="relative z-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto shadow-md">3</div>
            <h4 className="font-bold text-lg">{t('step3')}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed px-4">{t('step3Desc')}</p>
          </div>
          <div className="relative z-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto shadow-md">4</div>
            <h4 className="font-bold text-lg">{t('step4')}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed px-4">{t('step4Desc')}</p>
          </div>
        </div>
      </section>

      {/* 6. Blog Posts Preview */}
      {blogPosts.length > 0 && (
        <section className="relative z-10 container mx-auto px-4 sm:px-8 py-16 bg-card/80 backdrop-blur-2xl border border-foreground/15 rounded-3xl shadow-sm mb-16">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-3">{t('newsTitle')}</h2>
              <p className="text-muted-foreground text-sm">{t('newsSub')}</p>
            </div>
            <Link href="/blog" className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline group">
              View All
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map(post => {
              const trans = post.translations.find(tr => tr.locale === locale) || post.translations.find(tr => tr.locale === 'en') || post;
              return (
                <div key={post.id} className="rounded-2xl overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all group">
                  <div className="p-6">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-3">
                      {post.category}
                    </span>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {trans.title}
                    </h3>
                  </div>
                  <div className="p-6 pt-0 flex justify-between items-center text-xs text-muted-foreground border-t border-border/20 mt-4">
                    <span>{post.readTimeMinutes} min read</span>
                    <Link href={`/blog`} className="text-primary font-bold hover:underline">
                      Read Post
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 7. Bottom CTA Banner */}
      <section className="relative z-10 container mx-auto px-4 sm:px-8 py-20">
        <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/80 text-primary-foreground rounded-3xl p-8 md:p-16 text-center max-w-5xl mx-auto shadow-xl relative overflow-hidden">
          {/* Subtle design accents in banner */}
          <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {t('ctaTitle')}
            </h2>
            <p className="text-sm sm:text-base text-primary-foreground/80 leading-relaxed">
              {t('ctaDesc')}
            </p>
            <div className="pt-4">
              <Link href="/auth/signup" className={buttonVariants({ variant: 'secondary', size: 'lg', className: 'font-bold bg-background text-primary hover:bg-background/95 transition-all shadow-md px-8' })}>
                {t('ctaBtn')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
