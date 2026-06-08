import type { GenerationMode, ProductInfo, SectionKind } from "@/src/types";

const CACHE_STORAGE_KEY = "detail-page-maker:generation-cache";
const CACHE_SCHEMA_VERSION = 1;
const SECTION_COPY_CACHE_KEY_VERSION = "section-copy@v8";

export type GenerationType = GenerationMode;

export type CachedSectionCopy = {
  key: string;
  sectionKind: SectionKind;
  content: string;
  createdAt: string;
  source: GenerationMode;
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

function debugCacheLog(label: string, payload: unknown) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.log(label, payload);
}

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function createNormalizedProductCacheInput(product: ProductInfo) {
  return {
    brandName: normalizeText(product.brandName),
    category: normalizeText(product.category),
    forbiddenPhrases: normalizeText(product.forbiddenPhrases),
    notes: normalizeText(product.notes),
    productName: normalizeText(product.productName),
    specs: normalizeText(product.specs),
    targetAudience: normalizeText(product.targetAudience),
    usp: normalizeText(product.usp),
  };
}

function normalizeCacheEntries(entries: Record<string, unknown>) {
  const normalizedEntries: Record<string, CachedSectionCopy> = {};

  for (const [storedKey, entry] of Object.entries(entries)) {
    if (
      !entry ||
      typeof entry !== "object" ||
      !("sectionKind" in entry) ||
      !("content" in entry) ||
      !("createdAt" in entry) ||
      !("source" in entry) ||
      typeof entry.sectionKind !== "string" ||
      typeof entry.content !== "string" ||
      typeof entry.createdAt !== "string" ||
      (entry.source !== "dummy" && entry.source !== "openai")
    ) {
      continue;
    }

    const entryKey = "key" in entry && typeof entry.key === "string"
      ? entry.key
      : storedKey;

    if (entryKey !== storedKey) {
      debugCacheLog("[cache-key-mismatch]", {
        storedKey,
        entryKey,
        sameKey: false,
      });
    }

    normalizedEntries[entryKey] = {
      key: entryKey,
      sectionKind: entry.sectionKind as SectionKind,
      content: entry.content,
      createdAt: entry.createdAt,
      source: entry.source,
    };
  }

  return normalizedEntries;
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
      entries: normalizeCacheEntries(parsedValue.entries),
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
    keyVersion: SECTION_COPY_CACHE_KEY_VERSION,
    generationType,
    product: createNormalizedProductCacheInput(product),
    sectionKind,
    tone,
  };

  const inputHash = hashString(stableStringify(normalizedInput));

  const key = `${SECTION_COPY_CACHE_KEY_VERSION}:${generationType}:${sectionKind}:${tone}:${inputHash}`;

  debugCacheLog("[cache-key]", {
    key,
    generationType,
    sectionKind,
    tone,
    inputHash,
  });

  return key;
}

export function getCachedSectionCopy(key: string): CachedSectionCopy | null {
  const store = readCacheStore();
  const cachedCopy = store.entries[key] ?? null;
  const storedKeys = Object.keys(store.entries);

  debugCacheLog("[cache-read]", key);
  debugCacheLog("[cache-read-match]", {
    hit: !!cachedCopy,
    readKey: key,
    storedKey: cachedCopy?.key ?? null,
    sameKey: cachedCopy?.key === key,
    storedKeyCount: storedKeys.length,
    storedKeys,
  });

  return cachedCopy;
}

export function debugSectionCache({
  cacheKey,
  sectionKind,
  generationType,
  hit,
}: {
  cacheKey: string;
  sectionKind: SectionKind;
  generationType: GenerationType;
  hit: boolean;
}) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.debug("[cache-debug]", {
    cacheKey,
    sectionKind,
    generationType,
    hit,
  });
}

export function saveCachedSectionCopy(entry: CachedSectionCopy) {
  const store = readCacheStore();

  debugCacheLog("[cache-save]", entry.key);

  store.entries[entry.key] = entry;

  const saved = writeCacheStore(store);
  const savedEntry = saved ? readCacheStore().entries[entry.key] ?? null : null;

  debugCacheLog("[cache-save-result]", {
    saved,
    savedKey: entry.key,
    storedKey: savedEntry?.key ?? null,
    sameKey: savedEntry?.key === entry.key,
  });

  return saved;
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
