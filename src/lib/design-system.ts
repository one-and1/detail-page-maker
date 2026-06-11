export const designTokens = {
  color: {
    primary: "cyan",
    secondary: "slate",
    accent: "amber",
    success: "emerald",
    warning: "amber",
    danger: "red",
    neutral: "slate",
  },
  spacing: {
    xs: "gap-1.5",
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
    xl: "gap-5",
    section: "px-5 py-5",
  },
  radius: {
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-[var(--radius-lg)]",
    full: "rounded-full",
  },
  shadow: {
    card: "shadow-[var(--shadow-card)]",
    elevated: "shadow-[var(--shadow-card-hover)]",
    none: "shadow-none",
  },
  border: {
    subtle: "border border-slate-200",
    control: "border border-slate-300",
    divider: "border-slate-100",
  },
  background: {
    app: "bg-slate-100",
    surface: "bg-white",
    muted: "bg-slate-50",
    hero: "bg-[linear-gradient(135deg,#0f172a_0%,#155e75_58%,#f59e0b_145%)]",
  },
  textColor: {
    strong: "text-slate-950",
    body: "text-slate-700",
    muted: "text-slate-500",
    inverse: "text-white",
  },
  text: {
    display: "text-2xl font-semibold tracking-normal text-slate-950",
    headline: "text-xl font-semibold tracking-normal text-slate-950",
    title: "text-base font-semibold text-slate-950",
    body: "text-sm leading-7 text-slate-700",
    caption: "text-xs leading-5 text-slate-500",
    label: "text-xs font-medium text-slate-600",
    overline: "text-xs font-semibold uppercase tracking-wide text-slate-400",
  },
  card: {
    base: "rounded-lg border border-slate-200 bg-white",
    padding: {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-5",
    },
    shadow: {
      none: "shadow-none",
      default: "shadow-[var(--shadow-card)]",
      elevated: "shadow-[var(--shadow-card-hover)]",
    },
  },
  button: {
    base: "inline-flex shrink-0 items-center justify-center rounded-md font-medium shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60",
    variant: {
      primary:
        "bg-cyan-700 text-white shadow-cyan-900/15 hover:bg-cyan-600 hover:shadow-md",
      secondary:
        "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100",
      ghost: "text-slate-700 shadow-none hover:bg-slate-100",
      danger:
        "border border-red-200 bg-white text-red-700 hover:border-red-300 hover:bg-red-50",
    },
    size: {
      sm: "px-3 py-2 text-xs",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-2.5 text-sm",
    },
  },
  badge: {
    info: "border-blue-200 bg-blue-50 text-blue-700",
    hot: "border-red-200 bg-red-50 text-red-700",
    new: "border-emerald-200 bg-emerald-50 text-emerald-700",
    point: "border-amber-200 bg-amber-50 text-amber-700",
    primary: "border-cyan-200 bg-cyan-50 text-cyan-700",
    secondary: "border-slate-200 bg-slate-50 text-slate-700",
    neutral: "border-slate-200 bg-slate-50 text-slate-700",
  },
} as const;

export const sectionContainerClass =
  "mx-auto grid";

export const previewContainerClass =
  "mx-auto max-w-[var(--preview-max-width)] px-5 py-8";

export const fieldControlClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200";
