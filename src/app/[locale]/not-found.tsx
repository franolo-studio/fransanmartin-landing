import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">{t('heading')}</h1>
      <Link
        href="/"
        className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        {t('backToHome')}
      </Link>
    </main>
  );
}
