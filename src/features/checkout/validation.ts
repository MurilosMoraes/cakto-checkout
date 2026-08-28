import { z } from "zod";
import { isCompleteCPF, isValidCPF, stripCPF } from "@/domain/cpf";

export type FieldName = "email" | "cpf";
export type FieldErrors = Partial<Record<FieldName, string>>;

export const buyerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .pipe(z.email("Digite um e-mail válido.")),
  cpf: z
    .string()
    .refine((value) => stripCPF(value).length > 0, "Informe seu CPF.")
    .refine(isCompleteCPF, "CPF incompleto.")
    .refine(isValidCPF, "CPF inválido."),
});

export interface BuyerInput {
  email: string;
  cpf: string;
}

export function validateBuyer(input: BuyerInput): FieldErrors {
  const result = buyerSchema.safeParse(input);
  if (result.success) return {};

  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as FieldName | undefined;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

export interface RevealState {
  touched: Partial<Record<FieldName, boolean>>;
  submitAttempted: boolean;
}

export function visibleErrors(
  errors: FieldErrors,
  { touched, submitAttempted }: RevealState,
): FieldErrors {
  if (submitAttempted) return errors;

  const visible: FieldErrors = {};
  for (const field of Object.keys(errors) as FieldName[]) {
    if (touched[field]) {
      visible[field] = errors[field];
    }
  }
  return visible;
}
