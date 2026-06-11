import type { HTMLAttributes } from "react";
import { cn } from "@/src/lib/class-names";
import { sectionContainerClass } from "@/src/lib/design-system";

type SectionContainerProps = HTMLAttributes<HTMLDivElement> & {
  maxWidth?: "default" | "preview";
  spacing?: "default" | "compact";
};

const maxWidthClass = {
  default: "max-w-[var(--section-max-width)]",
  preview: "max-w-[var(--preview-max-width)]",
} as const;

const spacingClass = {
  default: "gap-5 px-5 py-5",
  compact: "gap-4 px-5 py-4",
} as const;

export function SectionContainer({
  maxWidth = "default",
  spacing = "default",
  className,
  ...props
}: SectionContainerProps) {
  return (
    <div
      className={cn(
        sectionContainerClass,
        maxWidthClass[maxWidth],
        spacingClass[spacing],
        className,
      )}
      {...props}
    />
  );
}
