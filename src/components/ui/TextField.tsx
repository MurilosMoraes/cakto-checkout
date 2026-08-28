"use client";

import { useId, type ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

interface TextFieldProps extends Omit<ComponentPropsWithRef<"input">, "id"> {
  label: string;
  error?: string;
  hint?: string;
}

export function TextField({ label, error, hint, className, ...props }: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "w-full rounded-xl border bg-surface px-4 py-3 text-base text-ink placeholder:text-muted/60",
          "transition-colors duration-150 focus:outline-2 focus:outline-offset-0",
          error
            ? "border-red-400 focus:outline-red-500"
            : "border-hairline focus:border-brand-400 focus:outline-brand-400",
          className,
        )}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
