"use client";

import { memo, useId } from "react";
import type { InstallmentOption } from "./installmentOptions";

interface InstallmentSelectProps {
  value: number;
  options: InstallmentOption[];
  onChange: (installments: number) => void;
}

function InstallmentSelectImpl({ value, options, onChange }: InstallmentSelectProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        Parcelamento
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full appearance-none rounded-xl border border-hairline bg-surface px-4 py-3 text-base tabular-nums transition-colors duration-150 focus:border-brand-400 focus:outline-2 focus:outline-brand-400"
      >
        {options.map((option) => (
          <option key={option.installments} value={option.installments}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export const InstallmentSelect = memo(InstallmentSelectImpl);
