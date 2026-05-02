import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 border-t border-border px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
      <p className="text-balance">{t('availability')}</p>
      <small>{t('copyright')}</small>
    </footer>
  );
}
