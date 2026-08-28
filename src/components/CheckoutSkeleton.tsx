import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

function Block({ className }: { className?: string }) {
  return <div className={cn("rounded-md bg-hairline", className)} />;
}

function Card({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={cn("rounded-2xl bg-surface p-4 ring-1 ring-hairline", className)}>
      {children}
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando checkout"
      className="mx-auto flex w-full max-w-lg animate-pulse flex-col gap-4 px-4 py-4"
    >
      <Card className="flex flex-col gap-3">
        <Block className="h-5 w-4/5" />
        <Block className="h-3.5 w-1/3" />
        <Block className="h-8 w-40" />
        <div className="flex gap-2 border-t border-hairline pt-3">
          <Block className="h-6 w-32 rounded-full" />
          <Block className="h-6 w-28 rounded-full" />
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <Block className="h-4 w-24" />
        <div className="flex flex-col gap-2">
          <Block className="h-3.5 w-16" />
          <Block className="h-12 w-full rounded-xl" />
        </div>
        <div className="flex flex-col gap-2">
          <Block className="h-3.5 w-10" />
          <Block className="h-12 w-full rounded-xl" />
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <Block className="h-4 w-28" />
        <div className="grid grid-cols-2 gap-3">
          <Block className="h-[100px] rounded-xl" />
          <Block className="h-[100px] rounded-xl" />
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <Block className="h-4 w-40" />
        <Block className="h-3.5 w-2/3" />
        <div className="flex flex-col gap-2.5 pt-1">
          <Block className="h-3.5 w-full" />
          <Block className="h-6 w-1/2 self-end" />
        </div>
      </Card>

      <Block className="h-14 w-full rounded-xl" />
      <span className="sr-only">Carregando checkout</span>
    </div>
  );
}
