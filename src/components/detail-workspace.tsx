"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { DetailSectionDraft, ProductContextForm } from "@/src/types/detail-page";
import type { RevisionHistoryEntry } from "@/src/types/persisted-project";
import { applyPartialSectionRevision } from "@/src/lib/apply-partial-section-revision";
import { generateSectionCopy } from "@/src/lib/generate-section-copy";
import { loadProject, saveProject } from "@/src/lib/project-storage";
import {
  cappedHistoryAppend,
  clipSnippet,
} from "@/src/lib/revision-history-utils";
import { DUMMY_PRODUCT_CONTEXT, DUMMY_SECTIONS } from "@/src/lib/dummy-detail-data";
import { ProductInputForm } from "@/src/components/product-input-form";
import { SectionListPanel } from "@/src/components/section-list-panel";
import { DetailPreview } from "@/src/components/detail-preview";

function makeHistoryId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function buildEntry(
  partial: Omit<RevisionHistoryEntry, "id" | "at"> & {
    id?: string;
    at?: number;
  },
): RevisionHistoryEntry {
  return {
    id: partial.id ?? makeHistoryId(),
    at: partial.at ?? Date.now(),
    kind: partial.kind,
    sectionId: partial.sectionId,
    sectionLabel: partial.sectionLabel,
    summary: partial.summary,
    detail: partial.detail,
    snippetBefore: partial.snippetBefore,
    snippetAfter: partial.snippetAfter,
  };
}

export function DetailWorkspace() {
  const [product, setProduct] = useState<ProductContextForm>(DUMMY_PRODUCT_CONTEXT);
  const [sections, setSections] = useState<DetailSectionDraft[]>(DUMMY_SECTIONS);
  const [selectedId, setSelectedId] = useState<string | null>(
    DUMMY_SECTIONS[0]?.id ?? null,
  );

  const [revisionHistory, setRevisionHistory] = useState<RevisionHistoryEntry[]>(
    [],
  );

  const [hydrated, setHydrated] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const baselineBodiesRef = useRef<Record<string, string>>({});
  const productCommittedRef = useRef<string>(
    JSON.stringify(DUMMY_PRODUCT_CONTEXT),
  );
  const sectionsRef = useRef(sections);
  const bodyTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  useEffect(
    () => () => {
      bodyTimersRef.current.forEach((t) => clearTimeout(t));
      bodyTimersRef.current.clear();
    },
    [],
  );

  const clearBodyTimer = useCallback((sectionId: string) => {
    const t = bodyTimersRef.current.get(sectionId);
    if (t !== undefined) {
      clearTimeout(t);
      bodyTimersRef.current.delete(sectionId);
    }
  }, []);

  useEffect(() => {
    const doc = loadProject();
    if (doc) {
      setProduct(doc.product);
      setSections(doc.sections);
      setRevisionHistory(doc.revisionHistory);
      setSelectedId(doc.sections[0]?.id ?? null);
      setLastSavedAt(doc.savedAt);
      productCommittedRef.current = JSON.stringify(doc.product);
      baselineBodiesRef.current = Object.fromEntries(
        doc.sections.map((s) => [s.id, s.body]),
      );
    } else {
      productCommittedRef.current = JSON.stringify(DUMMY_PRODUCT_CONTEXT);
      baselineBodiesRef.current = Object.fromEntries(
        DUMMY_SECTIONS.map((s) => [s.id, s.body]),
      );
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      const at = saveProject({ product, sections, revisionHistory });
      if (at !== null) setLastSavedAt(at);
    }, 450);
    return () => clearTimeout(t);
  }, [hydrated, product, sections, revisionHistory]);

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      const json = JSON.stringify(product);
      if (json === productCommittedRef.current) return;
      productCommittedRef.current = json;
      setRevisionHistory((h) =>
        cappedHistoryAppend(
          h,
          buildEntry({
            kind: "product_edit",
            summary: "상품 정보(폼) 변경",
            detail: clipSnippet(
              `${product.brandName} · ${product.productName}`,
              120,
            ),
          }),
        ),
      );
    }, 1600);
    return () => clearTimeout(t);
  }, [product, hydrated]);

  const [revisionError, setRevisionError] = useState<{
    id: string;
    message: string;
  } | null>(null);

  const onBodyChange = useCallback(
    (id: string, body: string) => {
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, body } : s)),
      );

      clearBodyTimer(id);
      bodyTimersRef.current.set(
        id,
        setTimeout(() => {
          bodyTimersRef.current.delete(id);
          const row = sectionsRef.current.find((s) => s.id === id);
          const currentBody = row?.body ?? "";
          const base = baselineBodiesRef.current[id] ?? "";
          if (currentBody === base) return;
          const label = row?.label ?? id;
          setRevisionHistory((h) =>
            cappedHistoryAppend(
              h,
              buildEntry({
                kind: "section_body_edit",
                sectionId: id,
                sectionLabel: label,
                summary: `「${label}」본문 직접 편집`,
                snippetBefore: clipSnippet(base),
                snippetAfter: clipSnippet(currentBody),
              }),
            ),
          );
          baselineBodiesRef.current[id] = currentBody;
        }, 900),
      );
    },
    [clearBodyTimer],
  );

  const onGenerateSection = useCallback(
    (id: string) => {
      let afterBody = "";
      let entry: RevisionHistoryEntry | null = null;
      clearBodyTimer(id);
      setSections((prev) => {
        const row = prev.find((s) => s.id === id);
        if (!row) return prev;
        afterBody = generateSectionCopy(product, {
          kind: row.kind,
          label: row.label,
        });
        entry = buildEntry({
          kind: "section_generate",
          sectionId: id,
          sectionLabel: row.label,
          summary: `「${row.label}」카피 생성(덮어쓰기)`,
          snippetBefore: clipSnippet(row.body),
          snippetAfter: clipSnippet(afterBody),
        });
        return prev.map((s) =>
          s.id === id ? { ...s, body: afterBody } : s,
        );
      });
      if (entry) {
        setRevisionHistory((h) => cappedHistoryAppend(h, entry!));
        baselineBodiesRef.current[id] = afterBody;
      }
    },
    [product, clearBodyTimer],
  );

  const onReviseDraftChange = useCallback((id: string, reviseDraft: string) => {
    setRevisionError((prev) => (prev?.id === id ? null : prev));
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, reviseDraft } : s)),
    );
  }, []);

  const onApplyPartialRevision = useCallback((id: string) => {
    let feedback: { id: string; message: string } | null = null;
    let successEntry: RevisionHistoryEntry | null = null;
    let newFullBody = "";

    clearBodyTimer(id);
    setSections((prev) => {
      const row = prev.find((s) => s.id === id);
      if (!row) return prev;
      const res = applyPartialSectionRevision(row.body, row.reviseDraft);
      if (!res.ok) {
        feedback = { id, message: res.message };
        return prev;
      }
      feedback = null;
      newFullBody = res.body;
      successEntry = buildEntry({
        kind: "section_partial",
        sectionId: id,
        sectionLabel: row.label,
        summary: `「${row.label}」부분 반영`,
        detail: clipSnippet(row.reviseDraft, 400),
        snippetBefore: clipSnippet(row.body),
        snippetAfter: clipSnippet(res.body),
      });
      return prev.map((s) =>
        s.id !== id ? s : { ...s, body: res.body, reviseDraft: "" },
      );
    });
    setRevisionError(feedback);

    const appliedPartial = successEntry;
    if (appliedPartial !== null && newFullBody !== "") {
      const entryRow = appliedPartial;
      setRevisionHistory((h) => cappedHistoryAppend(h, entryRow));
      baselineBodiesRef.current[id] = newFullBody;
    }
  }, [clearBodyTimer]);

  const lastSavedLabel = useMemo(() => {
    if (lastSavedAt === null) return "—";
    try {
      return new Date(lastSavedAt).toLocaleString("ko-KR", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  }, [lastSavedAt]);

  const recentHistoryRows = [...revisionHistory].slice(-14).reverse();

  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-zinc-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              상세페이지 제작기
            </h1>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              작업 상태는 브라우저{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                localStorage
              </span>
              에 자동 저장됩니다. «생성»은 해당 섹션만 덮어쓰며, 접두 규칙 «부분
              반영»과 편집·폼 변경은 이력에 쌓입니다.
            </p>
          </div>
          <div className="shrink-0 space-y-1 text-right">
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500">
              {hydrated ? "저장 동기 완료" : "복원 준비 중…"}
            </p>
            <p className="text-xs font-medium text-zinc-800 dark:text-zinc-100">
              마지막 저장 {lastSavedLabel}
            </p>
            <p className="text-[11px] text-zinc-500">
              수정 이력{" "}
              <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                {revisionHistory.length}
              </span>
              건
            </p>
            <details className="text-left [&_summary]:cursor-pointer [&_summary]:text-[11px] [&_summary]:text-zinc-600 dark:[&_summary]:text-zinc-400">
              <summary>최근 이력 (최대 14건 표시)</summary>
              <ol className="mt-2 max-h-40 overflow-auto rounded-lg border border-zinc-100 bg-zinc-50 px-2 py-1.5 text-[10px] leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
                {recentHistoryRows.length === 0 ? (
                  <li className="list-inside list-decimal py-0.5">
                    아직 기록된 이력이 없습니다.
                  </li>
                ) : (
                  recentHistoryRows.map((e) => {
                    const t = new Date(e.at).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    });
                    return (
                      <li
                        key={e.id}
                        className="list-inside list-decimal py-0.5"
                      >
                        [{t}] {e.summary}
                      </li>
                    );
                  })
                )}
              </ol>
            </details>
          </div>
        </div>
      </div>

      <div className="flex min-h-[min(100vh-12rem,720px)] flex-1 flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 lg:w-[46%] lg:border-b-0 lg:border-r xl:w-[42%]">
          <ProductInputForm value={product} onChange={setProduct} />
        </aside>

        <section className="flex min-h-0 flex-1 flex-col bg-zinc-50/80 p-6 dark:bg-zinc-950/50">
          <SectionListPanel
            sections={sections}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onBodyChange={onBodyChange}
            onGenerateSection={onGenerateSection}
            onReviseDraftChange={onReviseDraftChange}
            onApplyPartialRevision={onApplyPartialRevision}
            revisionError={revisionError}
          />
        </section>
      </div>

      <footer className="border-t border-zinc-200 bg-zinc-100/80 p-6 dark:border-zinc-800 dark:bg-zinc-950/80">
        <DetailPreview product={product} sections={sections} />
      </footer>
    </div>
  );
}
