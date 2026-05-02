import Link from 'next/link';
import './globals.css';

// Global fallback for paths that escape the [locale] segment entirely
// (no request locale context available). Bilingual hardcoded copy
// keeps the page useful without depending on the i18n provider.
export default function NotFound() {
  return (
    <html lang="en">
      <body className="bg-background text-foreground font-sans">
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Page not found · Página no encontrada
          </h1>
          <div className="flex flex-col gap-2 text-muted-foreground sm:flex-row sm:gap-6">
            <Link href="/" className="underline underline-offset-4 hover:text-foreground">
              Back home
            </Link>
            <Link href="/es" className="underline underline-offset-4 hover:text-foreground">
              Volver al inicio
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
