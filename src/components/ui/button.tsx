import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/src/lib/class-names";
import { designTokens } from "@/src/lib/design-system";

type ButtonVariant = keyof typeof designTokens.button.variant;
type ButtonSize = keyof typeof designTokens.button.size;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "secondary",
  size = "sm",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        designTokens.button.base,
        designTokens.button.variant[variant],
        designTokens.button.size[size],
        className,
      )}
      {...props}
    />
  );
}
