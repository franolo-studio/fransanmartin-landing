import { setRequestLocale, getTranslations } from 'next-intl/server';

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight">{t('hero.name')}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t('hero.tagline')}</p>
        <p className="mt-6 text-zinc-300">{t('hero.pitch')}</p>
        <p className="mt-12 text-xs text-zinc-500">
          T2 stub: routing + catalogs working. Hero/Footer/StickyHeader land in T4–T6.
        </p>
      </div>
    </main>
  );
}
