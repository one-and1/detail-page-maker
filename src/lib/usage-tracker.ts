const USAGE_STORAGE_KEY = "detail-page-maker:usage";
const USAGE_SCHEMA_VERSION = 1;

export type UsageStats = {
  totalGenerations: number;
  cacheHits: number;
  cacheMisses: number;
  estimatedSavedRequests: number;
  lastGeneratedAt: string | null;
};

type UsageStore = UsageStats & {
  schemaVersion: number;
  usageDate: string;
};

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getEmptyStats(): UsageStats {
  return {
    totalGenerations: 0,
    cacheHits: 0,
    cacheMisses: 0,
    estimatedSavedRequests: 0,
    lastGeneratedAt: null,
  };
}

function getEmptyStore(): UsageStore {
  return {
    ...getEmptyStats(),
    schemaVersion: USAGE_SCHEMA_VERSION,
    usageDate: getTodayKey(),
  };
}

function normalizeCount(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : 0;
}

function toStats(store: UsageStore): UsageStats {
  return {
    totalGenerations: store.totalGenerations,
    cacheHits: store.cacheHits,
    cacheMisses: store.cacheMisses,
    estimatedSavedRequests: store.estimatedSavedRequests,
    lastGeneratedAt: store.lastGeneratedAt,
  };
}

function readUsageStore(): UsageStore {
  if (!canUseLocalStorage()) {
    return getEmptyStore();
  }

  let storedValue: string | null;

  try {
    storedValue = window.localStorage.getItem(USAGE_STORAGE_KEY);
  } catch {
    return getEmptyStore();
  }

  if (!storedValue) {
    return getEmptyStore();
  }

  try {
    const parsedValue = JSON.parse(storedValue) as Partial<UsageStore>;

    if (
      parsedValue.schemaVersion !== USAGE_SCHEMA_VERSION ||
      parsedValue.usageDate !== getTodayKey()
    ) {
      return getEmptyStore();
    }

    const cacheHits = normalizeCount(parsedValue.cacheHits);
    const cacheMisses = normalizeCount(parsedValue.cacheMisses);

    return {
      schemaVersion: USAGE_SCHEMA_VERSION,
      usageDate: parsedValue.usageDate,
      totalGenerations: normalizeCount(parsedValue.totalGenerations),
      cacheHits,
      cacheMisses,
      estimatedSavedRequests: cacheHits,
      lastGeneratedAt:
        typeof parsedValue.lastGeneratedAt === "string"
          ? parsedValue.lastGeneratedAt
          : null,
    };
  } catch {
    return getEmptyStore();
  }
}

function writeUsageStore(store: UsageStore) {
  if (!canUseLocalStorage()) {
    return false;
  }

  try {
    window.localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

export function loadUsageStats(): UsageStats {
  return toStats(readUsageStore());
}

export function recordCacheHit(generatedAt = new Date().toISOString()) {
  const store = readUsageStore();
  const nextStore: UsageStore = {
    ...store,
    totalGenerations: store.totalGenerations + 1,
    cacheHits: store.cacheHits + 1,
    estimatedSavedRequests: store.cacheHits + 1,
    lastGeneratedAt: generatedAt,
  };

  writeUsageStore(nextStore);

  return toStats(nextStore);
}

export function recordCacheMiss(generatedAt = new Date().toISOString()) {
  const store = readUsageStore();
  const nextStore: UsageStore = {
    ...store,
    totalGenerations: store.totalGenerations + 1,
    cacheMisses: store.cacheMisses + 1,
    lastGeneratedAt: generatedAt,
  };

  writeUsageStore(nextStore);

  return toStats(nextStore);
}

export function clearUsageStats() {
  if (!canUseLocalStorage()) {
    return getEmptyStats();
  }

  try {
    window.localStorage.removeItem(USAGE_STORAGE_KEY);
  } catch {
    return loadUsageStats();
  }

  return getEmptyStats();
}
