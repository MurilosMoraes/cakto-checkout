import { describe, expect, it } from "vitest";
import { applyBps, formatBps, formatBRL, percentToBps, toCents } from "./money";

describe("toCents", () => {
  it("converte reais para centavos inteiros", () => {
    expect(toCents(297)).toBe(29700);
    expect(toCents(497.0)).toBe(49700);
    expect(toCents(0.1)).toBe(10);
  });

  it("não carrega erro de ponto flutuante", () => {
    expect(toCents(1.005)).toBe(101);
    expect(toCents(19.99)).toBe(1999);
  });
});

describe("percentToBps", () => {
  it("converte percentual para basis points", () => {
    expect(percentToBps(0)).toBe(0);
    expect(percentToBps(3.99)).toBe(399);
    expect(percentToBps(4.99)).toBe(499);
    expect(percentToBps(100)).toBe(10_000);
  });
});

describe("applyBps", () => {
  it("aplica a taxa devolvendo centavos inteiros", () => {
    expect(applyBps(29700, 0)).toBe(0);
    expect(applyBps(29700, 399)).toBe(1185);
    expect(applyBps(29700, 2699)).toBe(8016);
  });

  it("nunca devolve fração de centavo", () => {
    for (let bps = 0; bps <= 3000; bps += 7) {
      expect(Number.isInteger(applyBps(29700, bps))).toBe(true);
    }
  });
});

describe("formatBRL", () => {
  it("formata centavos como moeda brasileira", () => {
    expect(formatBRL(29700)).toContain("297,00");
    expect(formatBRL(0)).toContain("0,00");
    expect(formatBRL(8016)).toContain("80,16");
  });
});

describe("formatBps", () => {
  it("formata basis points como percentual", () => {
    expect(formatBps(0)).toBe("0%");
    expect(formatBps(399)).toBe("3,99%");
    expect(formatBps(2699)).toBe("26,99%");
  });
});
