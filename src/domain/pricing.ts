import { applyBps, percentToBps, type Bps, type Cents } from "./money";

export const PAYMENT_METHODS = ["pix", "card"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const MIN_INSTALLMENTS = 1;
export const MAX_INSTALLMENTS = 12;

export const FEE_TABLE = {
  pix: percentToBps(0),
  cardSingle: percentToBps(3.99),
  cardInstallmentBase: percentToBps(4.99),
  cardInstallmentPerExtra: percentToBps(2),
} as const;

export interface Quote {
  method: PaymentMethod;
  installments: number;
  productPrice: Cents;
  buyerTotal: Cents;
  installmentAmount: Cents;
  firstInstallmentAmount: Cents;
  hasUnevenInstallments: boolean;
  feeBps: Bps;
  producerFee: Cents;
  producerNet: Cents;
}

export function clampInstallments(installments: number): number {
  if (!Number.isFinite(installments)) return MIN_INSTALLMENTS;
  return Math.min(MAX_INSTALLMENTS, Math.max(MIN_INSTALLMENTS, Math.trunc(installments)));
}

export function feeBpsFor(method: PaymentMethod, installments: number): Bps {
  if (method === "pix") return FEE_TABLE.pix;
  if (installments <= 1) return FEE_TABLE.cardSingle;
  return (
    FEE_TABLE.cardInstallmentBase +
    FEE_TABLE.cardInstallmentPerExtra * (installments - 1)
  );
}

export function quote(
  productPrice: Cents,
  method: PaymentMethod,
  installments: number,
): Quote {
  const effectiveInstallments =
    method === "pix" ? MIN_INSTALLMENTS : clampInstallments(installments);

  const feeBps = feeBpsFor(method, effectiveInstallments);
  const producerFee = applyBps(productPrice, feeBps);
  const buyerTotal = productPrice;
  const installmentAmount = Math.floor(buyerTotal / effectiveInstallments);
  const remainder = buyerTotal - installmentAmount * effectiveInstallments;

  return {
    method,
    installments: effectiveInstallments,
    productPrice,
    buyerTotal,
    installmentAmount,
    firstInstallmentAmount: installmentAmount + remainder,
    hasUnevenInstallments: remainder > 0,
    feeBps,
    producerFee,
    producerNet: buyerTotal - producerFee,
  };
}

export function calcularParcelas(productPrice: Cents): Quote[] {
  return Array.from({ length: MAX_INSTALLMENTS }, (_, index) =>
    quote(productPrice, "card", index + 1),
  );
}
