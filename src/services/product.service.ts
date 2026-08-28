import { productSchema, type Product } from "./schemas";

const PRODUCT_PAYLOAD = {
  id: 1,
  name: "Curso de Marketing Digital 2025",
  originalPrice: 497.0,
  currentPrice: 297.0,
  producer: "João Silva",
  format: "digital",
  deliveryTime: "imediato",
};

const SIMULATED_LATENCY_MS = 600;

export async function getProduct(): Promise<Product> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  return productSchema.parse(PRODUCT_PAYLOAD);
}
