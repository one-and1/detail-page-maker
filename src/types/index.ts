export type Tone = "clear" | "friendly" | "premium" | "minimal";

export type SectionKind = "hero" | "usp" | "spec" | "comparison" | "faq" | "cta";

export interface ProductInfo {
  projectName: string;
  clientName: string;
  brandName: string;
  productName: string;
  category: string;
  targetAudience: string;
  tone: Tone;
  usp: string;
  specs: string;
  forbiddenPhrases: string;
  notes: string;
}

export interface DetailSection {
  id: string;
  kind: SectionKind;
  title: string;
  description: string;
  copy: string;
}
