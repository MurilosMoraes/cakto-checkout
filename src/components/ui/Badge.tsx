import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "neutral" | "discount";

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-canvas text-muted",
  discount: "bg-amber-100 text-amber-900",
};

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
}

export function Badge({ tone = "neutral", children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
        TONE_CLASSES[tone],
      )}
    >
      {children}
    </span>
  );
}
