import { describe, expect, it } from "vitest";
import {
  calcularParcelas,
  clampInstallments,
  feeBpsFor,
  MAX_INSTALLMENTS,
  quote,
} from "./pricing";

const PRICE = 29700;

describe("feeBpsFor", () => {
  it("aplica a tabela de taxas do enunciado", () => {
    expect(feeBpsFor("pix", 1)).toBe(0);
    expect(feeBpsFor("card", 1)).toBe(399);
    expect(feeBpsFor("card", 2)).toBe(699);
    expect(feeBpsFor("card", 3)).toBe(899);
    expect(feeBpsFor("card", 12)).toBe(2699);
  });

  it("soma 2% por parcela extra além da primeira", () => {
    for (let n = 2; n <= MAX_INSTALLMENTS; n += 1) {
      expect(feeBpsFor("card", n)).toBe(499 + 200 * (n - 1));
    }
  });
});

describe("regra fundamental: o comprador paga sempre o preço do produto", () => {
  it("mantém buyerTotal igual ao preço em todos os métodos e parcelamentos", () => {
    expect(quote(PRICE, "pix", 1).buyerTotal).toBe(PRICE);
    for (let n = 1; n <= MAX_INSTALLMENTS; n += 1) {
      expect(quote(PRICE, "card", n).buyerTotal).toBe(PRICE);
    }
  });

  it("desconta a taxa do produtor, nunca do comprador", () => {
    const pix = quote(PRICE, "pix", 1);
    const card12 = quote(PRICE, "card", 12);

    expect(pix.producerFee).toBe(0);
    expect(pix.producerNet).toBe(PRICE);
    expect(card12.producerFee).toBe(8016);
    expect(card12.producerNet).toBe(21684);
    expect(card12.buyerTotal).toBe(pix.buyerTotal);
  });
});

describe("invariantes de centavo", () => {
  it("taxa + liquido sempre fecha com o total", () => {
    for (let n = 1; n <= MAX_INSTALLMENTS; n += 1) {
      const result = quote(PRICE, "card", n);
      expect(result.producerFee + result.producerNet).toBe(result.buyerTotal);
    }
  });

  it("a soma das parcelas sempre fecha com o total", () => {
    for (let n = 1; n <= MAX_INSTALLMENTS; n += 1) {
      const result = quote(PRICE, "card", n);
      const total =
        result.firstInstallmentAmount + (n - 1) * result.installmentAmount;
      expect(total).toBe(result.buyerTotal);
    }
  });

  it("a primeira parcela absorve o resto da divisão", () => {
    const seven = quote(PRICE, "card", 7);
    expect(seven.hasUnevenInstallments).toBe(true);
    expect(seven.firstInstallmentAmount).toBe(4248);
    expect(seven.installmentAmount).toBe(4242);

    const twelve = quote(PRICE, "card", 12);
    expect(twelve.hasUnevenInstallments).toBe(false);
    expect(twelve.installmentAmount).toBe(2475);
  });

  it("fecha o total para qualquer preço, não só o do mock", () => {
    for (const price of [1, 99, 100, 4999, 29700, 99999, 123457]) {
      for (let n = 1; n <= MAX_INSTALLMENTS; n += 1) {
        const result = quote(price, "card", n);
        expect(result.producerFee + result.producerNet).toBe(price);
        expect(
          result.firstInstallmentAmount + (n - 1) * result.installmentAmount,
        ).toBe(price);
      }
    }
  });
});

describe("normalização de entrada", () => {
  it("força uma parcela no PIX", () => {
    expect(quote(PRICE, "pix", 12).installments).toBe(1);
    expect(quote(PRICE, "pix", 12).producerFee).toBe(0);
  });

  it("limita o parcelamento à faixa suportada", () => {
    expect(clampInstallments(0)).toBe(1);
    expect(clampInstallments(99)).toBe(12);
    expect(clampInstallments(Number.NaN)).toBe(1);
    expect(clampInstallments(3.7)).toBe(3);
  });
});

describe("calcularParcelas", () => {
  it("devolve as doze opções de cartão", () => {
    const options = calcularParcelas(PRICE);
    expect(options).toHaveLength(12);
    expect(options[0].installments).toBe(1);
    expect(options[11].installments).toBe(12);
    expect(options.every((option) => option.buyerTotal === PRICE)).toBe(true);
  });
});
