import type {
  DetailSectionDraft,
  ProductContextForm,
} from "@/src/types/detail-page";
import type {
  PersistedProjectDocument,
  RevisionHistoryEntry,
  RevisionHistoryKind,
} from "@/src/types/persisted-project";
import { PERSIST_SCHEMA_VERSION } from "@/src/types/persisted-project";

const STORAGE_KEY = "detail-page-maker:project:v1";

function isProductContext(o: unknown): o is ProductContextForm {
  if (!o || typeof o !== "object") return false;
  const x = o as Record<string, unknown>;
  const tones = ["professional", "friendly", "luxury", "minimal"];
  const kindStr = (v: unknown) => typeof v === "string";
  return (
    kindStr(x.projectName) &&
    kindStr(x.clientName) &&
    kindStr(x.brandName) &&
    kindStr(x.category) &&
    kindStr(x.productName) &&
    kindStr(x.targetAudience) &&
    typeof x.tone === "string" &&
    tones.includes(x.tone as string) &&
    kindStr(x.forbiddenPhrases) &&
    kindStr(x.usp) &&
    kindStr(x.specs) &&
    kindStr(x.legalNotes)
  );
}

function isSectionKinds(k: unknown): k is DetailSectionDraft["kind"] {
  return (
    k === "hero" ||
    k === "spec" ||
    k === "compare" ||
    k === "faq" ||
    k === "cta"
  );
}

/** 구버전 payload(id/body 등) 호환용 */
export function normalizeSection(raw: Record<string, unknown>): DetailSectionDraft | null {
  if (
    typeof raw.id !== "string" ||
    !isSectionKinds(raw.kind) ||
    typeof raw.label !== "string" ||
    typeof raw.body !== "string"
  ) {
    return null;
  }
  return {
    id: raw.id,
    kind: raw.kind,
    label: raw.label,
    body: raw.body,
    reviseDraft:
      typeof raw.reviseDraft === "string" ? raw.reviseDraft : "",
  };
}

function isHistoryKind(k: unknown): k is RevisionHistoryKind {
  return (
    k === "section_generate" ||
    k === "section_partial" ||
    k === "section_body_edit" ||
    k === "product_edit"
  );
}

function isHistoryEntry(o: unknown): o is RevisionHistoryEntry {
  if (!o || typeof o !== "object") return false;
  const x = o as Record<string, unknown>;
  const optStr = (v: unknown) => v === undefined || typeof v === "string";
  return (
    typeof x.id === "string" &&
    typeof x.at === "number" &&
    isHistoryKind(x.kind) &&
    optStr(x.sectionId) &&
    optStr(x.sectionLabel) &&
    typeof x.summary === "string" &&
    optStr(x.detail) &&
    optStr(x.snippetBefore) &&
    optStr(x.snippetAfter)
  );
}

function parsePersisted(raw: unknown): PersistedProjectDocument | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (o.version !== PERSIST_SCHEMA_VERSION || typeof o.savedAt !== "number") {
    return null;
  }
  if (!isProductContext(o.product)) return null;
  if (!Array.isArray(o.sections)) return null;
  const sections: DetailSectionDraft[] = [];
  for (const item of o.sections) {
    if (!item || typeof item !== "object") return null;
    const n = normalizeSection(item as Record<string, unknown>);
    if (!n) return null;
    sections.push(n);
  }
  let revisionHistory: RevisionHistoryEntry[] = [];
  if (o.revisionHistory !== undefined) {
    if (!Array.isArray(o.revisionHistory)) return null;
    for (const row of o.revisionHistory) {
      if (!isHistoryEntry(row)) return null;
      revisionHistory.push(row);
    }
  }
  return {
    version: PERSIST_SCHEMA_VERSION,
    savedAt: o.savedAt,
    product: o.product,
    sections,
    revisionHistory,
  };
}

export function loadProject(): PersistedProjectDocument | null {
  if (typeof window === "undefined") return null;
  try {
    const rawJson = window.localStorage.getItem(STORAGE_KEY);
    if (!rawJson) return null;
    return parsePersisted(JSON.parse(rawJson));
  } catch {
    return null;
  }
}

export function saveProject(snapshot: {
  product: ProductContextForm;
  sections: DetailSectionDraft[];
  revisionHistory: RevisionHistoryEntry[];
}): number | null {
  if (typeof window === "undefined") return null;
  const doc: PersistedProjectDocument = {
    version: PERSIST_SCHEMA_VERSION,
    savedAt: Date.now(),
    product: snapshot.product,
    sections: snapshot.sections,
    revisionHistory: snapshot.revisionHistory,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
    return doc.savedAt;
  } catch {
    return null;
  }
}
