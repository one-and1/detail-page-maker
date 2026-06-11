import type { HTMLAttributes } from "react";
import { cn } from "@/src/lib/class-names";
import { designTokens } from "@/src/lib/design-system";

type BadgeVariant = keyof typeof designTokens.badge;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeVariant;
  variant?: BadgeVariant;
};

export function Badge({
  className,
  tone,
  variant = tone ?? "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium",
        designTokens.badge[variant],
        className,
      )}
      {...props}
    />
  );
}
