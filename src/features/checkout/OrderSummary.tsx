"use client";

import { memo, type ReactNode } from "react";
import { formatBps, formatBRL, type Cents } from "@/domain/money";
import type { Quote } from "@/domain/pricing";
import { cn } from "@/lib/cn";

interface OrderSummaryProps {
  quote: Quote;
  productName: string;
  producerName: string;
  pixSavings: Cents;
}

interface RowProps {
  label: ReactNode;
  value: ReactNode;
  variant?: "default" | "total" | "producer";
}

const LABEL_CLASSES = {
  default: "text-sm text-muted",
  total: "text-sm font-semibold",
  producer: "text-sm font-semibold text-brand-700",
} as const;

const VALUE_CLASSES = {
  default: "text-sm font-medium tabular-nums",
  total: "text-xl font-bold tabular-nums",
  producer: "text-base font-bold tabular-nums text-brand-700",
} as const;

function Row({ label, value, variant = "default" }: RowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className={LABEL_CLASSES[variant]}>{label}</span>
      <span className={VALUE_CLASSES[variant]}>{value}</span>
    </div>
  );
}

function OrderSummaryImpl({
  quote,
  productName,
  producerName,
  pixSavings,
}: OrderSummaryProps) {
  const isInstallment = quote.method === "card" && quote.installments > 1;

  return (
    <section
      aria-labelledby="order-summary-title"
      className="rounded-2xl bg-surface p-4 ring-1 ring-hairline"
    >
      <h2 id="order-summary-title" className="text-base font-semibold">
        Resumo do pedido
      </h2>
      <p className="mt-0.5 truncate text-sm text-muted">{productName}</p>

      <div className="mt-3.5 flex flex-col gap-2.5">
        <Row label="Produto" value={formatBRL(quote.productPrice)} />

        {isInstallment &&
          (quote.hasUnevenInstallments ? (
            <>
              <Row label="1ª parcela" value={formatBRL(quote.firstInstallmentAmount)} />
              <Row
                label={`+ ${quote.installments - 1}x de`}
                value={formatBRL(quote.installmentAmount)}
              />
            </>
          ) : (
            <Row
              label={`${quote.installments}x de`}
              value={formatBRL(quote.installmentAmount)}
            />
          ))}

        <div className="border-t border-hairline pt-2.5">
          <Row label="Total" value={formatBRL(quote.buyerTotal)} variant="total" />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 border-t border-hairline pt-3.5">
        <Row
          label={`Taxa Cakto (${formatBps(quote.feeBps)})`}
          value={
            quote.producerFee > 0 ? `- ${formatBRL(quote.producerFee)}` : formatBRL(0)
          }
        />
        <Row
          label={`${producerName} recebe`}
          value={formatBRL(quote.producerNet)}
          variant="producer"
        />
        {pixSavings > 0 && (
          <p
            className={cn(
              "text-xs font-medium",
              quote.method === "pix" ? "text-brand-700" : "text-muted",
            )}
          >
            Escolhendo PIX, {producerName} economiza {formatBRL(pixSavings)} em taxas.
          </p>
        )}
        <p className="text-xs leading-relaxed text-muted">
          A taxa é descontada do produtor e não altera o total pago por você.
        </p>
      </div>
    </section>
  );
}

export const OrderSummary = memo(OrderSummaryImpl);
