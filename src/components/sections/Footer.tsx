import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 border-t border-border px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
      <address className="not-italic">
        <a
          href={`mailto:${t('contact.email')}`}
          className="underline-offset-4 hover:text-foreground hover:underline"
        >
          {t('contact.email')}
        </a>
      </address>
      <small>{t('footer.copyright')}</small>
    </footer>
  );
}
