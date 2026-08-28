"use client";

import dynamic from "next/dynamic";
import { useRef, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { LockIcon } from "@/components/ui/icons";
import { formatBRL } from "@/domain/money";
import type { Product } from "@/services/schemas";
import { BuyerFields } from "./BuyerFields";
import { InstallmentSelect } from "./InstallmentSelect";
import { OrderSummary } from "./OrderSummary";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { useCheckout } from "./useCheckout";

const OrderSuccess = dynamic(
  () => import("./OrderSuccess").then((module) => module.OrderSuccess),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto flex w-full max-w-lg animate-pulse flex-col gap-4 px-4 py-6">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-hairline px-6 py-9">
          <div className="size-20 rounded-full bg-surface/60" />
          <div className="h-7 w-52 rounded-md bg-surface/60" />
          <div className="h-4 w-64 rounded-md bg-surface/60" />
        </div>
        <div className="h-40 w-full rounded-2xl bg-hairline" />
        <div className="mx-auto h-3.5 w-3/4 rounded-md bg-hairline" />
      </div>
    ),
  },
);

interface CheckoutScreenProps {
  product: Product;
  children: ReactNode;
  terms?: ReactNode;
}

export function CheckoutScreen({ product, children, terms }: CheckoutScreenProps) {
  const checkout = useCheckout(product);
  const emailRef = useRef<HTMLInputElement>(null);
  const cpfRef = useRef<HTMLInputElement>(null);

  if (checkout.isSuccess && checkout.orderId) {
    return (
      <OrderSuccess
        orderId={checkout.orderId}
        email={checkout.email}
        productName={product.name}
        quote={checkout.quote}
      />
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const firstInvalid = await checkout.submit();
    if (!firstInvalid) return;

    const target = (firstInvalid === "email" ? emailRef : cpfRef).current;
    if (!target) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
    target.focus({ preventScroll: true });
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      noValidate
      className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-4"
    >
      {children}

      <section className="flex flex-col gap-4 rounded-2xl bg-surface p-4 ring-1 ring-hairline">
        <h2 className="text-base font-semibold">Seus dados</h2>
        <BuyerFields
          email={checkout.email}
          cpf={checkout.cpf}
          emailError={checkout.errors.email}
          cpfError={checkout.errors.cpf}
          onEmailChange={checkout.changeEmail}
          onCpfChange={checkout.changeCpf}
          onEmailBlur={checkout.blurEmail}
          onCpfBlur={checkout.blurCpf}
          emailRef={emailRef}
          cpfRef={cpfRef}
        />
      </section>

      <section className="flex flex-col gap-4 rounded-2xl bg-surface p-4 ring-1 ring-hairline">
        <h2 className="text-base font-semibold">Pagamento</h2>
        <PaymentMethodSelector value={checkout.method} onChange={checkout.selectMethod} />
        {checkout.method === "card" && (
          <InstallmentSelect
            value={checkout.installments}
            options={checkout.installmentOptions}
            onChange={checkout.selectInstallments}
          />
        )}
      </section>

      <OrderSummary
        quote={checkout.quote}
        productName={product.name}
        producerName={product.producer}
        pixSavings={checkout.pixSavings}
      />

      <div className="sticky bottom-0 -mx-4 mt-1 border-t border-hairline bg-surface/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <div aria-live="polite">
          {checkout.submitError && (
            <p
              role="alert"
              className="mb-2.5 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
            >
              {checkout.submitError}
            </p>
          )}
        </div>
        <div className="mb-2.5 flex items-baseline justify-between">
          <span className="text-sm text-muted">Total</span>
          <span className="text-xl font-bold tabular-nums">
            {formatBRL(checkout.quote.buyerTotal)}
          </span>
        </div>
        <Button type="submit" isLoading={checkout.isSubmitting}>
          {checkout.isSubmitting ? "Processando..." : "Pagar agora"}
        </Button>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted">
          <LockIcon className="size-3.5" />
          Compra segura
        </p>
      </div>

      {terms}
    </form>
  );
}
