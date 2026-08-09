import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { buttonVariants } from './ui/button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const t = useTranslations('Navigation');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold sm:inline-block text-xl">
            ESTQB Ethiopia
          </span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/certifications" className="transition-colors hover:text-foreground/80 text-foreground/60">
            {t('certifications')}
          </Link>
          <Link href="/blog" className="transition-colors hover:text-foreground/80 text-foreground/60">
            {t('blog')}
          </Link>
          <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
            {t('about')}
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <LanguageSwitcher />
          <Link href="/auth/signin" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            {t('signIn')}
          </Link>
          <Link href="/auth/signup" className={buttonVariants({ size: 'sm' })}>
            {t('register')}
          </Link>
        </div>
      </div>
    </header>
  );
}
