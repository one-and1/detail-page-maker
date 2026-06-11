import type { HTMLAttributes } from "react";
import { cn } from "@/src/lib/class-names";
import { designTokens } from "@/src/lib/design-system";

type TextVariant = keyof typeof designTokens.text;

type TextProps = HTMLAttributes<HTMLElement> & {
  as?: "p" | "span" | "h1" | "h2" | "h3" | "dt" | "dd";
  variant?: TextVariant;
};

export function Text({
  as = "p",
  variant = "body",
  className,
  ...props
}: TextProps) {
  const Component = as;

  return (
    <Component
      className={cn(designTokens.text[variant], className)}
      {...props}
    />
  );
}

export function Display(props: Omit<TextProps, "as" | "variant">) {
  return <Text as="h1" variant="display" {...props} />;
}

export function Headline(props: Omit<TextProps, "as" | "variant">) {
  return <Text as="h2" variant="headline" {...props} />;
}

export function Title(props: Omit<TextProps, "as" | "variant">) {
  return <Text as="h3" variant="title" {...props} />;
}

export function Body(props: Omit<TextProps, "as" | "variant">) {
  return <Text as="p" variant="body" {...props} />;
}

export function Caption(props: Omit<TextProps, "as" | "variant">) {
  return <Text as="p" variant="caption" {...props} />;
}
