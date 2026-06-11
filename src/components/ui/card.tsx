import type { HTMLAttributes } from "react";
import { cn } from "@/src/lib/class-names";
import { designTokens } from "@/src/lib/design-system";

type CardProps = HTMLAttributes<HTMLDivElement | HTMLElement> & {
  as?: "div" | "article" | "form" | "section";
  padding?: keyof typeof designTokens.card.padding;
  shadow?: keyof typeof designTokens.card.shadow;
};

export function Card({
  as = "div",
  padding = "md",
  shadow = "default",
  className,
  ...props
}: CardProps) {
  const Component = as;

  return (
    <Component
      className={cn(
        designTokens.card.base,
        designTokens.card.padding[padding],
        designTokens.card.shadow[shadow],
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border-b border-slate-200 px-5 py-4", className)}
      {...props}
    />
  );
}

export function CardBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-5", className)} {...props} />;
}
