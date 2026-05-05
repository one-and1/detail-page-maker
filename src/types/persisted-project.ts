import type { DetailSectionDraft, ProductContextForm } from "@/src/types/detail-page";

export const PERSIST_SCHEMA_VERSION = 1 as const;

export type RevisionHistoryKind =
  | "section_generate"
  | "section_partial"
  | "section_body_edit"
  | "product_edit";

/** localStorage 등에 저장하는 수정 이력 항목 */
export interface RevisionHistoryEntry {
  id: string;
  at: number;
  kind: RevisionHistoryKind;
  sectionId?: string;
  sectionLabel?: string;
  summary: string;
  /** 접두 지시 원문 등 (부분 수정), 축약 */
  detail?: string;
  snippetBefore?: string;
  snippetAfter?: string;
}

export interface PersistedProjectDocument {
  version: typeof PERSIST_SCHEMA_VERSION;
  savedAt: number;
  product: ProductContextForm;
  sections: DetailSectionDraft[];
  revisionHistory: RevisionHistoryEntry[];
}
