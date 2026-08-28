import { describe, expect, it } from "vitest";
import { quote } from "@/domain/pricing";

describe("consistência entre método e parcelamento", () => {
  it("PIX nunca cobra taxa, qualquer que seja o parcelamento anterior", () => {
    for (let previous = 1; previous <= 12; previous += 1) {
      const result = quote(29700, "pix", previous);
      expect(result.installments).toBe(1);
      expect(result.producerFee).toBe(0);
      expect(result.producerNet).toBe(29700);
    }
  });

  it("a economia com PIX é sempre a taxa do cartão equivalente", () => {
    for (let installments = 1; installments <= 12; installments += 1) {
      const card = quote(29700, "card", installments);
      const pix = quote(29700, "pix", installments);
      expect(pix.producerNet - card.producerNet).toBe(card.producerFee);
    }
  });
});
