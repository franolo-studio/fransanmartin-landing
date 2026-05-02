import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const OG_LOCALE: Record<string, string> = {
  en: 'en_US',
  es: 'es_ES',
};

function pathFor(locale: string) {
  return locale === routing.defaultLocale ? '' : `/${locale}`;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: 'meta' });
  const canonical = `${SITE_URL}${pathFor(locale)}`;

  const languages: Record<string, string> = {
    'x-default': SITE_URL,
  };
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}${pathFor(l)}`;
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: canonical,
      siteName: SITE_NAME,
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: t('ogTitle'),
        },
      ],
      locale: OG_LOCALE[locale] ?? OG_LOCALE.en,
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
