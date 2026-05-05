"use client";

import type { DetailSectionDraft, ProductContextForm } from "@/src/types/detail-page";

type Props = {
  product: ProductContextForm;
  sections: DetailSectionDraft[];
};

const toneKo: Record<ProductContextForm["tone"], string> = {
  professional: "전문·신뢰",
  friendly: "친근·대화형",
  luxury: "럭셔리·격식",
  minimal: "미니멀·건조",
};

export function DetailPreview({ product, sections }: Props) {
  const upsFirstLine =
    product.usp
      .split("\n")
      .map((l) => l.replace(/^[\s\-•*]+/, "").trim())
      .find(Boolean) ?? "";

  return (
    <div className="rounded-xl border border-zinc-200 bg-[#fafafa] shadow-inner dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="flex flex-col gap-1 border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
          고객 화면 미리보기
        </span>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {product.brandName} · {product.productName}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          프로젝트: {product.projectName} · 톤: {toneKo[product.tone]}
        </p>
      </div>

      <div className="mx-auto max-w-[640px] space-y-0 bg-white px-6 py-10 text-[15px] leading-relaxed text-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 sm:px-10">
        {upsFirstLine ? (
          <p className="mb-10 border-l-4 border-zinc-300 pl-4 text-[15px] text-zinc-700 dark:border-zinc-600 dark:text-zinc-300">
            {upsFirstLine}
          </p>
        ) : null}

        {sections.map((section, idx) => (
          <section
            key={section.id}
            className={idx > 0 ? "mt-14 border-t border-zinc-100 pt-14 dark:border-zinc-900" : undefined}
          >
            <h4 className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              {section.label}
            </h4>
            <div className="whitespace-pre-wrap text-[15px] leading-7 text-zinc-800 dark:text-zinc-200">
              {section.body}
            </div>
          </section>
        ))}

        {product.specs.trim() ? (
          <aside className="mt-14 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-[13px] text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
            <span className="mb-3 block font-semibold text-zinc-700 dark:text-zinc-300">
              참고 스펙 (편집 영역 원문)
            </span>
            <div className="whitespace-pre-wrap leading-6">{product.specs}</div>
          </aside>
        ) : null}

        <div className="mt-14 border-t border-zinc-100 pt-10 text-[11px] text-zinc-400 dark:border-zinc-900 dark:text-zinc-600">
          <p>
            타깃 요약 문구 길면 상세 기획으로 이동 권장. 법무 메모는 고객 화면에
            노출하지 않습니다.
          </p>
          {product.legalNotes.trim() ? (
            <p className="mt-4 hidden text-zinc-500 sm:block dark:text-zinc-500">
              (내부) {product.legalNotes.slice(0, 200)}
              {product.legalNotes.length > 200 ? "…" : ""}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
