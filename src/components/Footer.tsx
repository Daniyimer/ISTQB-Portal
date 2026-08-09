import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="border-t bg-muted/40 py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">ESTQB Ethiopia</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            {t('description')}
          </p>
        </div>
        <div>
          <h4 className="font-medium mb-4">{t('certificationsTitle')}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/certifications/foundation" className="hover:text-primary transition-colors">{t('foundation')}</Link></li>
            <li><Link href="/certifications/agile" className="hover:text-primary transition-colors">{t('agile')}</Link></li>
            <li><Link href="/certifications/advanced" className="hover:text-primary transition-colors">{t('advanced')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-4">{t('resourcesTitle')}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/blog" className="hover:text-primary transition-colors">{t('news')}</Link></li>
            <li><Link href="/verify-certificate" className="hover:text-primary transition-colors">{t('verify')}</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">{t('contact')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-8 mt-12 pt-8 border-t border-border/40 text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} {t('rights')}</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-primary transition-colors">{t('privacy')}</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">{t('terms')}</Link>
        </div>
      </div>
    </footer>
  );
}
