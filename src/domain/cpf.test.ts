import { describe, expect, it } from "vitest";
import { isCompleteCPF, isValidCPF, maskCPF, stripCPF } from "./cpf";

const VALID_CPFS = [
  "529.982.247-25",
  "111.444.777-35",
  "123.456.789-09",
  "987.654.321-00",
  "045.678.912-01",
];

describe("stripCPF", () => {
  it("mantém apenas dígitos e limita a onze", () => {
    expect(stripCPF("529.982.247-25")).toBe("52998224725");
    expect(stripCPF("529982247259999")).toBe("52998224725");
    expect(stripCPF("abc")).toBe("");
  });
});

describe("maskCPF", () => {
  it("aplica a máscara progressivamente durante a digitação", () => {
    expect(maskCPF("5")).toBe("5");
    expect(maskCPF("529")).toBe("529");
    expect(maskCPF("5299")).toBe("529.9");
    expect(maskCPF("529982")).toBe("529.982");
    expect(maskCPF("5299822")).toBe("529.982.2");
    expect(maskCPF("529982247")).toBe("529.982.247");
    expect(maskCPF("52998224725")).toBe("529.982.247-25");
  });

  it("é idempotente sobre um valor já mascarado", () => {
    expect(maskCPF("529.982.247-25")).toBe("529.982.247-25");
  });

  it("ignora caracteres não numéricos", () => {
    expect(maskCPF("52a9b98c2")).toBe("529.982");
  });
});

describe("isValidCPF", () => {
  it("aceita os dois formatos exigidos pelo enunciado", () => {
    expect(isValidCPF("529.982.247-25")).toBe(true);
    expect(isValidCPF("52998224725")).toBe(true);
  });

  it("valida os dígitos verificadores", () => {
    for (const cpf of VALID_CPFS) {
      expect(isValidCPF(cpf)).toBe(true);
    }
  });

  it("rejeita dígito verificador errado", () => {
    expect(isValidCPF("529.982.247-24")).toBe(false);
    expect(isValidCPF("123.456.789-01")).toBe(false);
  });

  it("rejeita sequências de dígitos repetidos", () => {
    for (let digit = 0; digit <= 9; digit += 1) {
      expect(isValidCPF(String(digit).repeat(11))).toBe(false);
    }
  });

  it("rejeita entrada com dígitos a mais em vez de truncar", () => {
    expect(isValidCPF("529.982.247-250")).toBe(false);
    expect(isValidCPF("5299822472599999")).toBe(false);
  });

  it("rejeita entradas incompletas ou vazias", () => {
    expect(isValidCPF("")).toBe(false);
    expect(isValidCPF("5299822472")).toBe(false);
    expect(isValidCPF("529.982.247")).toBe(false);
  });
});

describe("isCompleteCPF", () => {
  it("distingue incompleto de inválido", () => {
    expect(isCompleteCPF("529.982.247-2")).toBe(false);
    expect(isCompleteCPF("529.982.247-24")).toBe(true);
    expect(isValidCPF("529.982.247-24")).toBe(false);
  });
});
