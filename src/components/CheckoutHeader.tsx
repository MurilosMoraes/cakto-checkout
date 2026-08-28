import Image from "next/image";
import { LockIcon } from "./ui/icons";

export function CheckoutHeader() {
  return (
    <header className="border-b border-hairline bg-surface">
      <div className="mx-auto flex w-full max-w-lg items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-2">
          <Image src="/cakto-logo.png" alt="Cakto" width={28} height={28} priority />
          <span className="text-lg font-bold tracking-tight">Cakto</span>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
          <LockIcon className="size-4" />
          Compra segura
        </span>
      </div>
    </header>
  );
}
