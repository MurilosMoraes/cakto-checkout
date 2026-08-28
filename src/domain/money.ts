export type Cents = number;
export type Bps = number;

export function toCents(value: number): Cents {
  return Math.round(Number((value * 100).toFixed(4)));
}

export function percentToBps(percent: number): Bps {
  return Math.round(percent * 100);
}

export function applyBps(amount: Cents, rate: Bps): Cents {
  return Math.round((amount * rate) / 10_000);
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatBRL(amount: Cents): string {
  return currencyFormatter.format(amount / 100);
}

export function formatBps(rate: Bps): string {
  return `${(rate / 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;
}
