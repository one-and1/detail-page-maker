import type { ProductInfo, SectionKind } from "@/src/types";

const CACHE_STORAGE_KEY = "detail-page-maker:generation-cache";
const CACHE_SCHEMA_VERSION = 1;

export type GenerationType = "dummy";

export type CachedSectionCopy = {
  key: string;
  sectionKind: SectionKind;
  content: string;
  createdAt: string;
  source: "dummy";
};

type CacheStore = {
  schemaVersion: number;
  entries: Record<string, CachedSectionCopy>;
};

type SectionCacheKeyInput = {
  product: ProductInfo;
  sectionKind: SectionKind;
  tone: ProductInfo["tone"];
  generationType: GenerationType;
};

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

function readCacheStore(): CacheStore {
  if (!canUseLocalStorage()) {
    return { schemaVersion: CACHE_SCHEMA_VERSION, entries: {} };
  }

  let storedValue: string | null;

  try {
    storedValue = window.localStorage.getItem(CACHE_STORAGE_KEY);
  } catch {
    return { schemaVersion: CACHE_SCHEMA_VERSION, entries: {} };
  }

  if (!storedValue) {
    return { schemaVersion: CACHE_SCHEMA_VERSION, entries: {} };
  }

  try {
    const parsedValue = JSON.parse(storedValue) as Partial<CacheStore>;

    if (
      parsedValue.schemaVersion !== CACHE_SCHEMA_VERSION ||
      !parsedValue.entries ||
      typeof parsedValue.entries !== "object"
    ) {
      return { schemaVersion: CACHE_SCHEMA_VERSION, entries: {} };
    }

    return {
      schemaVersion: CACHE_SCHEMA_VERSION,
      entries: Object.fromEntries(
        Object.entries(parsedValue.entries).filter(
          ([key, entry]) =>
            typeof key === "string" &&
            !!entry &&
            typeof entry === "object" &&
            entry.key === key &&
            typeof entry.sectionKind === "string" &&
            typeof entry.content === "string" &&
            typeof entry.createdAt === "string" &&
            entry.source === "dummy",
        ),
      ),
    };
  } catch {
    return { schemaVersion: CACHE_SCHEMA_VERSION, entries: {} };
  }
}

function writeCacheStore(store: CacheStore) {
  if (!canUseLocalStorage()) {
    return false;
  }

  try {
    window.localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

export function createSectionCacheKey({
  product,
  sectionKind,
  tone,
  generationType,
}: SectionCacheKeyInput) {
  const normalizedInput = {
    generationType,
    product: {
      brandName: normalizeText(product.brandName),
      category: normalizeText(product.category),
      clientName: normalizeText(product.clientName),
      forbiddenPhrases: normalizeText(product.forbiddenPhrases),
      notes: normalizeText(product.notes),
      productName: normalizeText(product.productName),
      projectName: normalizeText(product.projectName),
      specs: normalizeText(product.specs),
      targetAudience: normalizeText(product.targetAudience),
      usp: normalizeText(product.usp),
    },
    sectionKind,
    tone,
  };

  return `section-copy:${generationType}:${sectionKind}:${tone}:${hashString(
    stableStringify(normalizedInput),
  )}`;
}

export function getCachedSectionCopy(key: string): CachedSectionCopy | null {
  return readCacheStore().entries[key] ?? null;
}

export function saveCachedSectionCopy(entry: CachedSectionCopy) {
  const store = readCacheStore();

  store.entries[entry.key] = entry;

  return writeCacheStore(store);
}

export function clearSectionCopyCache() {
  if (!canUseLocalStorage()) {
    return false;
  }

  try {
    window.localStorage.removeItem(CACHE_STORAGE_KEY);
    return window.localStorage.getItem(CACHE_STORAGE_KEY) === null;
  } catch {
    return false;
  }
}
