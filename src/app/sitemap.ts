import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';

function pathFor(locale: string) {
  return locale === routing.defaultLocale ? '' : `/${locale}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const languages: Record<string, string> = {
    'x-default': SITE_URL,
  };
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}${pathFor(l)}`;
  }

  return routing.locales.map((locale) => ({
    url: `${SITE_URL}${pathFor(locale)}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 1,
    alternates: { languages },
  }));
}
