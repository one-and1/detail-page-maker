export type SectionKind = "hero" | "spec" | "compare" | "faq" | "cta";

export interface ProductContextForm {
  projectName: string;
  clientName: string;
  brandName: string;
  category: string;
  productName: string;
  targetAudience: string;
  tone: "professional" | "friendly" | "luxury" | "minimal";
  forbiddenPhrases: string;
  usp: string;
  specs: string;
  legalNotes: string;
}

export interface DetailSectionDraft {
  id: string;
  kind: SectionKind;
  label: string;
  body: string;
  /** 섹션별 부분 수정 지시(접두어 형식). 본문과 별도로 둡니다. */
  reviseDraft: string;
}
