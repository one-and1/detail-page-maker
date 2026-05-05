"use client";

import { useCallback, useState } from "react";
import type { DetailSectionDraft, ProductContextForm } from "@/src/types/detail-page";
import { applyPartialSectionRevision } from "@/src/lib/apply-partial-section-revision";
import { generateSectionCopy } from "@/src/lib/generate-section-copy";
import { DUMMY_PRODUCT_CONTEXT, DUMMY_SECTIONS } from "@/src/lib/dummy-detail-data";
import { ProductInputForm } from "@/src/components/product-input-form";
import { SectionListPanel } from "@/src/components/section-list-panel";
import { DetailPreview } from "@/src/components/detail-preview";

export function DetailWorkspace() {
  const [product, setProduct] = useState<ProductContextForm>(DUMMY_PRODUCT_CONTEXT);
  const [sections, setSections] = useState<DetailSectionDraft[]>(DUMMY_SECTIONS);
  const [selectedId, setSelectedId] = useState<string | null>(
    DUMMY_SECTIONS[0]?.id ?? null,
  );

  /** 부분 수정 실패 안내 — 해당 섹션 카드 아래에만 노출 */
  const [revisionError, setRevisionError] = useState<{
    id: string;
    message: string;
  } | null>(null);

  const onBodyChange = useCallback((id: string, body: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, body } : s)),
    );
  }, []);

  /** 섹션 1건씩만 갱신 — 전체 페이지 생성 경로 없음 */
  const onGenerateSection = useCallback((id: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== id
          ? s
          : {
              ...s,
              body: generateSectionCopy(product, {
                kind: s.kind,
                label: s.label,
              }),
            },
      ),
    );
  }, [product]);

  const onReviseDraftChange = useCallback((id: string, reviseDraft: string) => {
    setRevisionError((prev) => (prev?.id === id ? null : prev));
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, reviseDraft } : s)),
    );
  }, []);

  const onApplyPartialRevision = useCallback((id: string) => {
    let feedback: { id: string; message: string } | null = null;
    setSections((prev) => {
      const row = prev.find((s) => s.id === id);
      if (!row) return prev;
      const res = applyPartialSectionRevision(row.body, row.reviseDraft);
      if (!res.ok) {
        feedback = { id, message: res.message };
        return prev;
      }
      feedback = null;
      return prev.map((s) =>
        s.id !== id ? s : { ...s, body: res.body, reviseDraft: "" },
      );
    });
    setRevisionError(feedback);
  }, []);

  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-zinc-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          상세페이지 제작기
        </h1>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          «생성»은 해당 섹션 본문만 덮어씁니다. «부분 반영»은 접두어(추가·앞줄·삭제·교체)
          규칙으로만 수정해 전체를 비우지 않습니다. 전체 페이지 일괄 생성은 없으며 API도
          없습니다.
        </p>
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
