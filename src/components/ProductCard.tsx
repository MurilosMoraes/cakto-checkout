import { formatBRL } from "@/domain/money";
import type { Product } from "@/services/schemas";
import { Badge } from "./ui/Badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercent = Math.round(
    (1 - product.currentPrice / product.originalPrice) * 100,
  );

  return (
    <section
      aria-labelledby="product-name"
      className="rounded-2xl bg-surface p-4 ring-1 ring-hairline"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 id="product-name" className="text-lg font-bold leading-snug text-balance">
            {product.name}
          </h1>
          <p className="mt-1 text-sm text-muted">por {product.producer}</p>
        </div>
        {discountPercent > 0 && <Badge tone="discount">-{discountPercent}%</Badge>}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight tabular-nums">
          {formatBRL(product.currentPrice)}
        </span>
        <span className="text-base text-muted line-through tabular-nums">
          {formatBRL(product.originalPrice)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-hairline pt-3">
        <Badge>Acesso {product.deliveryTime}</Badge>
        <Badge>Produto {product.format === "digital" ? "digital" : "físico"}</Badge>
      </div>
    </section>
  );
}
