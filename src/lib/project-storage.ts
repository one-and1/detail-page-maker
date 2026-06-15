import type { PersistedProject, ProductImageAsset, ProductInfo } from "@/src/types";
import { normalizeTone } from "@/src/lib/tone-system";

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

function normalizeProductInfo(product: Partial<ProductInfo>): ProductInfo {
  return {
    projectName: typeof product.projectName === "string" ? product.projectName : "",
    clientName: typeof product.clientName === "string" ? product.clientName : "",
    brandName: typeof product.brandName === "string" ? product.brandName : "",
    productName: typeof product.productName === "string" ? product.productName : "",
    category: typeof product.category === "string" ? product.category : "",
    targetAudience:
      typeof product.targetAudience === "string" ? product.targetAudience : "",
    tone: normalizeTone(product.tone),
    usp: typeof product.usp === "string" ? product.usp : "",
    specs: typeof product.specs === "string" ? product.specs : "",
    forbiddenPhrases:
      typeof product.forbiddenPhrases === "string"
        ? product.forbiddenPhrases
        : "",
    notes: typeof product.notes === "string" ? product.notes : "",
  };
}

function normalizeProductImage(value: unknown): ProductImageAsset | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const image = value as Partial<ProductImageAsset>;

  if (
    typeof image.dataUrl !== "string" ||
    !image.dataUrl.startsWith("data:image/") ||
    typeof image.name !== "string" ||
    typeof image.type !== "string" ||
    typeof image.size !== "number" ||
    typeof image.updatedAt !== "string"
  ) {
    return null;
  }

  return {
    dataUrl: image.dataUrl,
    name: image.name,
    type: image.type,
    size: image.size,
    updatedAt: image.updatedAt,
  };
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

    return isPersistedProject(parsedDraft)
      ? {
          ...parsedDraft,
          product: normalizeProductInfo(parsedDraft.product),
          productImage: normalizeProductImage(parsedDraft.productImage),
        }
      : null;
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
