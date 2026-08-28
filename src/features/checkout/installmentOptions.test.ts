import { describe, expect, it } from "vitest";
import { formatBRL } from "@/domain/money";
import { buildInstallmentOptions } from "./installmentOptions";

const PRICE = 29700;

describe("buildInstallmentOptions", () => {
  const options = buildInstallmentOptions(PRICE);

  it("devolve as doze opções na ordem", () => {
    expect(options).toHaveLength(12);
    expect(options.map((option) => option.installments)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
  });

  it("rotula a primeira opção como à vista", () => {
    expect(options[0].label).toBe(`À vista: ${formatBRL(29700)}`);
  });

  it("omite a primeira parcela quando a divisão é exata", () => {
    expect(options[2].label).toBe(`3x de ${formatBRL(9900)} sem juros`);
    expect(options[11].label).toBe(`12x de ${formatBRL(2475)} sem juros`);
  });

  it("revela a primeira parcela quando a divisão não é exata", () => {
    expect(options[6].label).toBe(
      `7x de ${formatBRL(4242)} sem juros (1ª de ${formatBRL(4248)})`,
    );
    expect(options[7].label).toBe(
      `8x de ${formatBRL(3712)} sem juros (1ª de ${formatBRL(3716)})`,
    );
  });

  it("todo valor exibido no rótulo fecha com o total", () => {
    for (const option of options) {
      const centavos = [...option.label.matchAll(/R\$\s?([\d.]+),(\d{2})/g)].map(
        ([, reais, cents]) => Number(reais.replace(".", "")) * 100 + Number(cents),
      );
      const [primeiro, segundo] = centavos;
      const n = option.installments;

      if (n === 1) {
        expect(primeiro).toBe(PRICE);
      } else if (segundo === undefined) {
        expect(primeiro * n).toBe(PRICE);
      } else {
        expect(segundo + primeiro * (n - 1)).toBe(PRICE);
      }
    }
  });
});
