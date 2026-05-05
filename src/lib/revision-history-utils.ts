import type { RevisionHistoryEntry } from "@/src/types/persisted-project";

const DEFAULT_MAX = 200;

/** 스토리지·UI용 스니펫 길이 제한 */
export function clipSnippet(s: string, max = 240): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

export function cappedHistoryAppend(
  current: RevisionHistoryEntry[],
  entry: RevisionHistoryEntry,
  max = DEFAULT_MAX,
): RevisionHistoryEntry[] {
  const next = [...current, entry];
  if (next.length <= max) return next;
  return next.slice(next.length - max);
}
