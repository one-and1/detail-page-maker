import type { PersistedProject } from "@/src/types";

const STORAGE_KEY = "detail-page-maker:project-draft";

export const PROJECT_DRAFT_SCHEMA_VERSION = 1;

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isPersistedProject(value: unknown): value is PersistedProject {
  if (!value || typeof value !== "object") {
    return false;
  }

  const draft = value as Partial<PersistedProject>;

  return (
    draft.schemaVersion === PROJECT_DRAFT_SCHEMA_VERSION &&
    typeof draft.updatedAt === "string" &&
    !!draft.product &&
    typeof draft.product === "object" &&
    Array.isArray(draft.sections)
  );
}

export function saveProjectDraft(
  draft: Omit<PersistedProject, "updatedAt" | "schemaVersion">,
): PersistedProject | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  const persistedDraft: PersistedProject = {
    ...draft,
    updatedAt: new Date().toISOString(),
    schemaVersion: PROJECT_DRAFT_SCHEMA_VERSION,
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedDraft));
  } catch {
    return null;
  }

  return persistedDraft;
}

export function loadProjectDraft(): PersistedProject | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  let storedDraft: string | null;

  try {
    storedDraft = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }

  if (!storedDraft) {
    return null;
  }

  try {
    const parsedDraft = JSON.parse(storedDraft);

    return isPersistedProject(parsedDraft) ? parsedDraft : null;
  } catch {
    return null;
  }
}

export function clearProjectDraft() {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
}
