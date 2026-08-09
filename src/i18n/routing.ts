import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'am', 'ar', 'de', 'fr', 'es', 'it', 'ja', 'ko', 'zh', 'pt', 'pl', 'ru', 'tr', 'hi'],
  defaultLocale: 'en'
});

export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);
