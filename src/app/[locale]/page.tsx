import {getTranslations, setRequestLocale} from 'next-intl/server';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('HomePage');

  return (
    <div className="flex flex-col flex-1 w-full relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        {/* Glowing Orbs for Ethiopian Flag colors */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#009A44] opacity-30 dark:opacity-20 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
        <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] rounded-full bg-[#FED100] opacity-30 dark:opacity-20 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-pulse delay-700"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[55%] h-[55%] rounded-full bg-[#EF3340] opacity-25 dark:opacity-15 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse delay-1000"></div>
        
        <Image
          src="/images/hero-bg.png"
          alt="Hero Background"
          fill
          className="object-cover opacity-10 dark:opacity-30 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px]" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-8 py-24 md:py-32 flex flex-col flex-1 items-center justify-center text-center">
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl mb-6 text-foreground drop-shadow-sm pb-2">
          {t('title')}
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
          {t('description')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/certifications" className={buttonVariants({ size: 'lg', className: 'w-full sm:w-auto shadow-lg shadow-primary/20' })}>
            {t('explore')}
          </Link>
          <Link href="/about" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'w-full sm:w-auto backdrop-blur-sm bg-background/50' })}>
            {t('learnAbout')}
          </Link>
        </div>
      </div>
    </div>
  );
}
