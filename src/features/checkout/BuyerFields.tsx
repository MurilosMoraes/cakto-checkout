"use client";

import type { Ref } from "react";
import { TextField } from "@/components/ui/TextField";

interface BuyerFieldsProps {
  email: string;
  cpf: string;
  emailError?: string;
  cpfError?: string;
  onEmailChange: (value: string) => void;
  onCpfChange: (value: string) => void;
  onEmailBlur?: () => void;
  onCpfBlur?: () => void;
  emailRef?: Ref<HTMLInputElement>;
  cpfRef?: Ref<HTMLInputElement>;
}

export function BuyerFields({
  email,
  cpf,
  emailError,
  cpfError,
  onEmailChange,
  onCpfChange,
  onEmailBlur,
  onCpfBlur,
  emailRef,
  cpfRef,
}: BuyerFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <TextField
        ref={emailRef}
        label="E-mail"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="voce@email.com"
        value={email}
        error={emailError}
        hint="Enviamos o acesso ao curso para este e-mail."
        onChange={(event) => onEmailChange(event.target.value)}
        onBlur={onEmailBlur}
      />
      <TextField
        ref={cpfRef}
        label="CPF"
        inputMode="numeric"
        autoComplete="off"
        placeholder="000.000.000-00"
        maxLength={14}
        value={cpf}
        error={cpfError}
        onChange={(event) => onCpfChange(event.target.value)}
        onBlur={onCpfBlur}
      />
    </div>
  );
}
