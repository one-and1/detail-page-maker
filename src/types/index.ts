export type Tone = "clear" | "friendly" | "premium" | "minimal";

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

export interface PersistedProject {
  product: ProductInfo;
  sections: DetailSection[];
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
