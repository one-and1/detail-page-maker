export const SUPPORTED_TONES = [
  "premium",
  "emotional",
  "clean",
  "professional",
] as const;

export type Tone = (typeof SUPPORTED_TONES)[number];

export type SectionKind = "hero" | "usp" | "spec" | "comparison" | "faq" | "cta";

export type GenerationMode = "dummy" | "openai";

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

export interface ProductImageAsset {
  dataUrl: string;
  name: string;
  type: string;
  size: number;
  updatedAt: string;
}

export interface PersistedProject {
  product: ProductInfo;
  sections: DetailSection[];
  productImage?: ProductImageAsset | null;
  updatedAt: string;
  schemaVersion: number;
}

export interface GenerateSectionInput {
  sectionKind: SectionKind;
  product: ProductInfo;
  tone: Tone;
  generationMode?: GenerationMode;
}

export interface GeneratedSectionCopy {
  content: string;
  sectionKind: SectionKind;
  source: GenerationMode;
  generatedAt: string;
}
