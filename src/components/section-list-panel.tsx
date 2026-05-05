"use client";

import type { DetailSectionDraft, SectionKind } from "@/src/types/detail-page";

const KIND_LABEL: Record<SectionKind, string> = {
  hero: "히어로",
  spec: "스펙",
  compare: "비교",
  faq: "FAQ",
  cta: "CTA",
};

const REVISE_PLACEHOLDER = [
  "첫 줄에 접두어만 사용합니다 (예: «짧게 해줘»처럼 접두어 없으면 차단)",
  "추가:",
  "(맨 아래에 붙일 문단)",
  "",
  "앞줄:",
  "(본문 첫 줄 앞 문장)",
  "",
  "삭제:",
  "(본문에서 그대로 복사한 문구)",
  "",
  "교체:",
  "기존 문구 한 덩어리>>>바꿀 내용",
].join("\n");

type Props = {
  sections: DetailSectionDraft[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBodyChange: (id: string, body: string) => void;
  /** 해당 섹션만 카피 갱신 (전체 페이지 일괄 생성 없음) */
  onGenerateSection: (id: string) => void;
  onReviseDraftChange: (id: string, reviseDraft: string) => void;
  onApplyPartialRevision: (id: string) => void;
  revisionError: { id: string; message: string } | null;
};

export function SectionListPanel({
  sections,
  selectedId,
  onSelect,
  onBodyChange,
  onGenerateSection,
  onReviseDraftChange,
  onApplyPartialRevision,
  revisionError,
}: Props) {
  const resolvedId = selectedId ?? sections[0]?.id ?? null;

  const selected =
    resolvedId !== null
      ? (sections.find((s) => s.id === resolvedId) ?? null)
      : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <header className="shrink-0 space-y-1">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          상세페이지 섹션
        </h2>
        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          «생성»은 전체 카피를 다시 채웁니다. «부분 반영»은 접두어만 인식합니다.
          페이지 전체 재생성·API 호출 없음.
        </p>
      </header>

      <ul className="flex max-h-[min(56vh,640px)] flex-col gap-3 overflow-auto pr-1 pb-2">
        {sections.map((section) => {
          const isActive =
            resolvedId !== null && section.id === resolvedId;
          const preview =
            section.body.split("\n").find((l) => l.trim())?.slice(0, 72) ?? "";
          const errSame = revisionError?.id === section.id;

          return (
            <li key={section.id}>
              <div
                className={[
                  "flex flex-col gap-3 rounded-xl border p-3 transition-colors",
                  isActive
                    ? "border-zinc-900 bg-zinc-50 shadow-sm dark:border-zinc-200 dark:bg-zinc-900/70"
                    : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950",
                ].join(" ")}
              >
                <div className="flex gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => onSelect(section.id)}
                    className="min-w-0 flex-1 rounded-lg px-2 py-2 text-left outline-none hover:bg-white/70 focus-visible:ring-2 focus-visible:ring-zinc-400 dark:hover:bg-zinc-900/80"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-zinc-200 px-2 py-0.5 font-mono text-[10px] font-medium uppercase text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                        {KIND_LABEL[section.kind]}
                      </span>
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {section.label}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                      {preview || "내용 없음"}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onGenerateSection(section.id);
                      onSelect(section.id);
                    }}
                    className="shrink-0 self-start rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-900 hover:text-white dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
                  >
                    생성
                  </button>
                </div>

                <div className="space-y-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <label className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                      부분 수정 지시
                    </label>
                    <button
                      type="button"
                      onClick={() => onApplyPartialRevision(section.id)}
                      className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-950 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-100 dark:hover:bg-amber-950/70"
                    >
                      부분 반영
                    </button>
                  </div>
                  <textarea
                    className="min-h-[88px] w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50/80 px-2.5 py-2 font-mono text-[11px] leading-relaxed text-zinc-800 outline-none ring-amber-500/70 focus:bg-white focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 dark:focus:bg-zinc-950"
                    value={section.reviseDraft}
                    spellCheck={false}
                    aria-invalid={errSame ? true : undefined}
                    aria-describedby={
                      errSame ? `revise-err-${section.id}` : undefined
                    }
                    placeholder={REVISE_PLACEHOLDER}
                    onChange={(e) =>
                      onReviseDraftChange(section.id, e.target.value)
                    }
                  />
                  {errSame ? (
                    <p
                      id={`revise-err-${section.id}`}
                      role="alert"
                      className="rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-[11px] text-red-900 dark:border-red-900 dark:bg-red-950/60 dark:text-red-100"
                    >
                      {revisionError.message}
                    </p>
                  ) : (
                    <p className="text-[10px] leading-relaxed text-zinc-500 dark:text-zinc-500">
                      형식 접두어만 처리합니다. 줄바꿈을 포함해 «삭제:» 뒤에는 본문과
                      같은 문자열을 붙여 넣으세요.
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex min-h-0 shrink-0 flex-col gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            선택 섹션 — 본문 직접 편집
          </span>
          {selected && (
            <span className="truncate text-[11px] text-zinc-500 dark:text-zinc-500">
              {selected.label}
            </span>
          )}
        </div>
        {!selected ? (
          <p className="rounded-lg border border-dashed border-zinc-300 px-3 py-6 text-center text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-500">
            섹션을 선택하세요.
          </p>
        ) : (
          <textarea
            className="min-h-[160px] w-full flex-1 resize-y rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm leading-relaxed text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            value={selected.body}
            onChange={(e) => onBodyChange(selected.id, e.target.value)}
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}
