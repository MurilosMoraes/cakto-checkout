import { Suspense } from "react";
import { CheckoutHeader } from "@/components/CheckoutHeader";
import { CheckoutSkeleton } from "@/components/CheckoutSkeleton";
import { ProductCard } from "@/components/ProductCard";
import { CheckoutScreen } from "@/features/checkout/CheckoutScreen";
import { getProduct } from "@/services/product.service";

async function Checkout() {
  const product = await getProduct();

  const terms = (
    <p className="px-1 pt-1 text-center text-xs leading-relaxed text-muted">
      Ao prosseguir, você concorda com os Termos de uso de{" "}
      <strong className="font-semibold text-ink">{product.producer}</strong>, além dos
      Termos e Políticas da Cakto.
    </p>
  );

  return (
    <>
      <CheckoutScreen product={product} terms={terms}>
        <ProductCard product={product} />
      </CheckoutScreen>
      <footer className="mx-auto w-full max-w-lg px-4 pb-8 pt-2 text-center">
        <p className="text-xs font-medium text-muted">Processado por Cakto</p>
      </footer>
    </>
  );
}

export default function Page() {
  return (
    <>
      <CheckoutHeader />
      <main className="flex-1">
        <Suspense fallback={<CheckoutSkeleton />}>
          <Checkout />
        </Suspense>
      </main>
    </>
  );
}
