import { describe, expect, it } from "vitest";
import { validateBuyer, visibleErrors } from "./validation";

const VALID = { email: "murilo@exemplo.com", cpf: "529.982.247-25" };

describe("validateBuyer", () => {
  it("não acusa erro quando tudo está correto", () => {
    expect(validateBuyer(VALID)).toEqual({});
  });

  it("exige e-mail", () => {
    expect(validateBuyer({ ...VALID, email: "" }).email).toBe("Informe seu e-mail.");
    expect(validateBuyer({ ...VALID, email: "   " }).email).toBe(
      "Informe seu e-mail.",
    );
  });

  it("rejeita e-mail malformado", () => {
    expect(validateBuyer({ ...VALID, email: "murilo" }).email).toBe(
      "Digite um e-mail válido.",
    );
    expect(validateBuyer({ ...VALID, email: "murilo@" }).email).toBe(
      "Digite um e-mail válido.",
    );
  });

  it("separa CPF vazio, incompleto e inválido", () => {
    expect(validateBuyer({ ...VALID, cpf: "" }).cpf).toBe("Informe seu CPF.");
    expect(validateBuyer({ ...VALID, cpf: "529.982" }).cpf).toBe("CPF incompleto.");
    expect(validateBuyer({ ...VALID, cpf: "529.982.247-24" }).cpf).toBe(
      "CPF inválido.",
    );
  });

  it("acusa os dois campos de uma vez", () => {
    const errors = validateBuyer({ email: "", cpf: "" });
    expect(Object.keys(errors).sort()).toEqual(["cpf", "email"]);
  });
});

describe("visibleErrors", () => {
  const errors = { email: "Informe seu e-mail.", cpf: "Informe seu CPF." };

  it("não revela erro em campo que o usuário ainda não tocou", () => {
    expect(visibleErrors(errors, { touched: {}, submitAttempted: false })).toEqual({});
  });

  it("revela apenas o campo tocado", () => {
    expect(
      visibleErrors(errors, { touched: { email: true }, submitAttempted: false }),
    ).toEqual({ email: "Informe seu e-mail." });
  });

  it("revela tudo depois de uma tentativa de envio", () => {
    expect(visibleErrors(errors, { touched: {}, submitAttempted: true })).toEqual(
      errors,
    );
  });
});
