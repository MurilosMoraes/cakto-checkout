"use client";

import Image from "next/image";
import { CheckIcon } from "@/components/ui/icons";
import { formatBRL } from "@/domain/money";
import type { Quote } from "@/domain/pricing";

interface OrderSuccessProps {
  orderId: string;
  email: string;
  productName: string;
  quote: Quote;
}

export function OrderSuccess({ orderId, email, productName, quote }: OrderSuccessProps) {
  const isInstallment = quote.method === "card" && quote.installments > 1;

  return (
    <section
      aria-labelledby="order-success-title"
      className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-6"
    >
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand-400 to-brand-700 px-6 py-9 text-center text-white">
        <Image
          src="/cakto-logo.png"
          alt=""
          aria-hidden="true"
          width={240}
          height={240}
          className="pointer-events-none absolute -right-14 -top-14 select-none opacity-10"
        />

        <div className="relative mx-auto w-fit">
          <span className="flex size-20 items-center justify-center rounded-full bg-white shadow-lg">
            <Image src="/cakto-logo.png" alt="" width={44} height={44} />
          </span>
          <span className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-white text-brand-600 shadow-md">
            <CheckIcon className="size-5" />
          </span>
        </div>

        <h1 id="order-success-title" className="relative mt-5 text-2xl font-bold">
          Compra confirmada
        </h1>
        <p className="relative mt-2 text-pretty text-sm leading-relaxed text-white/85">
          Enviamos o acesso para{" "}
          <strong className="font-semibold text-white">{email}</strong>
        </p>
      </div>

      <div className="rounded-2xl bg-surface p-4 ring-1 ring-hairline">
        <p className="text-base font-semibold text-balance">{productName}</p>

        <dl className="mt-4 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-muted">Pedido</dt>
            <dd className="font-mono text-sm font-semibold tabular-nums">{orderId}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-muted">Forma de pagamento</dt>
            <dd className="text-sm font-medium">
              {quote.method === "pix"
                ? "PIX"
                : isInstallment
                  ? `Cartão ${quote.installments}x de ${formatBRL(quote.installmentAmount)}`
                  : "Cartão à vista"}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t border-hairline pt-2.5">
            <dt className="text-sm font-semibold">Total pago</dt>
            <dd className="text-xl font-bold tabular-nums">
              {formatBRL(quote.buyerTotal)}
            </dd>
          </div>
        </dl>
      </div>

      <p className="text-center text-xs leading-relaxed text-muted">
        Não recebeu o e-mail? Confira a caixa de spam ou fale com o suporte informando o
        número do pedido.
      </p>
    </section>
  );
}
