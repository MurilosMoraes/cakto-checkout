import { z } from "zod";
import { toCents } from "@/domain/money";

export const productSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  originalPrice: z.number().positive().transform(toCents),
  currentPrice: z.number().positive().transform(toCents),
  producer: z.string().min(1),
  format: z.enum(["digital", "physical"]),
  deliveryTime: z.string().min(1),
});

export type Product = z.infer<typeof productSchema>;
