import type { PaymentMethod } from "@/domain/pricing";

export interface OrderDraft {
  productId: number;
  email: string;
  cpf: string;
  method: PaymentMethod;
  installments: number;
}

export type CreateOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; reason: "invalid" | "declined" | "unavailable" };

const SIMULATED_LATENCY_MS = 1200;

export async function createOrder(draft: OrderDraft): Promise<CreateOrderResult> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

  return {
    ok: true,
    orderId: `CKT-${draft.productId}-${Date.now().toString(36).toUpperCase()}`,
  };
}
