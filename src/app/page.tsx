import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Fran Sanmartín</h1>
        <p className="mt-4 text-muted-foreground">
          Scaffold OK. Locale routing and content land in T2 — T7.
        </p>
        <div className="mt-8">
          <Button>Smoke test — focus me with Tab</Button>
        </div>
      </div>
    </main>
  );
}
