"use client";

import { memo } from "react";
import { CardIcon, PixIcon } from "@/components/ui/icons";
import type { PaymentMethod } from "@/domain/pricing";
import { cn } from "@/lib/cn";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const CARD_BASE =
  "relative flex h-[100px] flex-col items-center justify-center gap-2 rounded-xl border-2 " +
  "text-sm font-semibold transition-all duration-150 " +
  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-600";

const CARD_SELECTED = "border-brand-600 bg-brand-600 text-white shadow-lg";
const CARD_IDLE = "border-hairline bg-surface text-muted shadow-sm hover:shadow-md";

function PaymentMethodSelectorImpl({ value, onChange }: PaymentMethodSelectorProps) {
  const isPix = value === "pix";

  return (
    <fieldset>
      <legend className="mb-2.5 text-sm font-semibold text-ink">
        Forma de pagamento
      </legend>
      <div className="grid grid-cols-2 gap-3">
        <label className="cursor-pointer">
          <input
            type="radio"
            name="payment-method"
            value="pix"
            checked={isPix}
            onChange={() => onChange("pix")}
            className="peer sr-only"
          />
          <div className={cn(CARD_BASE, isPix ? CARD_SELECTED : CARD_IDLE)}>
            <span aria-hidden="true" className="absolute -top-2.5 rounded-full bg-brand-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Recomendado
            </span>
            <PixIcon className="size-6" />
            PIX
          </div>
        </label>

        <label className="cursor-pointer">
          <input
            type="radio"
            name="payment-method"
            value="card"
            checked={!isPix}
            onChange={() => onChange("card")}
            className="peer sr-only"
          />
          <div className={cn(CARD_BASE, isPix ? CARD_IDLE : CARD_SELECTED)}>
            <CardIcon className="size-6" />
            Cartão de crédito
          </div>
        </label>
      </div>
    </fieldset>
  );
}

export const PaymentMethodSelector = memo(PaymentMethodSelectorImpl);
