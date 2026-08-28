import { formatBRL, type Cents } from "@/domain/money";
import { calcularParcelas } from "@/domain/pricing";

export interface InstallmentOption {
  installments: number;
  label: string;
}

export function buildInstallmentOptions(productPrice: Cents): InstallmentOption[] {
  return calcularParcelas(productPrice).map((option) => {
    if (option.installments === 1) {
      return {
        installments: 1,
        label: `À vista: ${formatBRL(option.buyerTotal)}`,
      };
    }

    const base = `${option.installments}x de ${formatBRL(option.installmentAmount)} sem juros`;

    return {
      installments: option.installments,
      label: option.hasUnevenInstallments
        ? `${base} (1ª de ${formatBRL(option.firstInstallmentAmount)})`
        : base,
    };
  });
}
