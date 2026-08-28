"use client";

import { Button } from "@/components/ui/Button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-xl font-bold">Não foi possível carregar o checkout</h1>
      <p className="text-pretty text-sm text-muted">
        Tivemos um problema ao buscar os dados do produto. Nenhuma cobrança foi feita.
      </p>
      <Button type="button" onClick={reset} className="mt-2 w-auto px-8">
        Tentar novamente
      </Button>
    </main>
  );
}
