const CPF_LENGTH = 11;

export function stripCPF(input: string): string {
  return input.replace(/\D/g, "").slice(0, CPF_LENGTH);
}

export function maskCPF(input: string): string {
  const digits = stripCPF(input);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function checkDigit(digits: string, factor: number): number {
  let sum = 0;
  for (const digit of digits) {
    sum += Number(digit) * factor--;
  }
  const remainder = (sum * 10) % 11;
  return remainder === 10 ? 0 : remainder;
}

export function isValidCPF(input: string): boolean {
  const digits = input.replace(/\D/g, "");

  if (digits.length !== CPF_LENGTH) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  if (checkDigit(digits.slice(0, 9), 10) !== Number(digits[9])) return false;
  return checkDigit(digits.slice(0, 10), 11) === Number(digits[10]);
}

export function isCompleteCPF(input: string): boolean {
  return stripCPF(input).length === CPF_LENGTH;
}
