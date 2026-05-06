"use client";

import { useEffect, useRef, useState } from "react";
import type { DetailSection, ProductInfo } from "@/src/types";

type Props = {
  product: ProductInfo;
  sections: DetailSection[];
  onSectionCopyChange: (sectionId: DetailSection["id"], copy: string) => void;
};

const toneLabel: Record<ProductInfo["tone"], string> = {
  clear: "명확하고 실용적",
  friendly: "친근한 설명형",
  premium: "프리미엄",
  minimal: "미니멀",
};

const FALLBACK_PROJECT_NAME = "새 프로젝트";

type CopyTarget = "all" | DetailSection["id"];
type CopyStatus = {
  kind: "success" | "error";
  target: CopyTarget;
  message: string;
} | null;

const formatSectionForCopy = (section: DetailSection) =>
  `${section.title}\n\n${section.copy.trim()}`;

const formatAllSectionsForCopy = (sections: DetailSection[]) =>
  sections.map(formatSectionForCopy).join("\n\n---\n\n");

export function DetailPreview({
  product,
  sections,
  onSectionCopyChange,
}: Props) {
  const [editingSectionId, setEditingSectionId] = useState<
    DetailSection["id"] | null
  >(null);
  const [draftCopy, setDraftCopy] = useState("");
  const [copyStatus, setCopyStatus] = useState<CopyStatus>(null);
  const copyMessageTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyMessageTimeoutRef.current) {
        window.clearTimeout(copyMessageTimeoutRef.current);
      }
    };
  }, []);

  const showCopyStatus = (status: Exclude<CopyStatus, null>) => {
    setCopyStatus(status);

    if (copyMessageTimeoutRef.current) {
      window.clearTimeout(copyMessageTimeoutRef.current);
    }

    copyMessageTimeoutRef.current = window.setTimeout(() => {
      setCopyStatus(null);
      copyMessageTimeoutRef.current = null;
    }, 1800);
  };

  const copyText = async (text: string, target: CopyTarget) => {
    try {
      if (
        typeof window === "undefined" ||
        typeof navigator === "undefined" ||
        !navigator.clipboard?.writeText
      ) {
        throw new Error("Clipboard API is unavailable.");
      }

      await navigator.clipboard.writeText(text);
      showCopyStatus({ kind: "success", target, message: "복사 완료" });
    } catch {
      showCopyStatus({
        kind: "error",
        target,
        message: "복사에 실패했습니다. 브라우저 권한을 확인해 주세요.",
      });
    }
  };

  const startEditing = (section: DetailSection) => {
    setEditingSectionId(section.id);
    setDraftCopy(section.copy);
  };

  const cancelEditing = () => {
    setEditingSectionId(null);
    setDraftCopy("");
  };

  const saveEditing = (sectionId: DetailSection["id"]) => {
    onSectionCopyChange(sectionId, draftCopy);
    cancelEditing();
  };
  const projectName = product.projectName.trim() || FALLBACK_PROJECT_NAME;

  return (
    <article className="min-w-0 rounded-lg border border-zinc-200 bg-white shadow-sm">
      <header className="border-b border-zinc-200 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-500">섹션 미리보기</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">
              {product.brandName} {product.productName}
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              {projectName} · {toneLabel[product.tone]}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <button
              type="button"
              className="rounded-md bg-zinc-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-zinc-700"
              onClick={() => copyText(formatAllSectionsForCopy(sections), "all")}
            >
              전체 복사
            </button>
            {copyStatus?.target === "all" ? (
              <p
                className={
                  copyStatus.kind === "success"
                    ? "text-xs font-medium text-emerald-700"
                    : "text-xs font-medium text-red-700"
                }
                role="status"
              >
                {copyStatus.message}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-5 py-8">
        {sections.map((section, index) => (
          <section
            key={section.id}
            className={index === 0 ? "" : "mt-10 border-t border-zinc-100 pt-10"}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  {section.kind}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">
                  {section.title}
                </h3>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100"
                    onClick={() => copyText(formatSectionForCopy(section), section.id)}
                  >
                    복사
                  </button>
                  {editingSectionId !== section.id ? (
                    <button
                      type="button"
                      className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100"
                      onClick={() => startEditing(section)}
                    >
                      수정
                    </button>
                  ) : null}
                </div>
                {copyStatus?.target === section.id ? (
                  <p
                    className={
                      copyStatus.kind === "success"
                        ? "text-xs font-medium text-emerald-700"
                        : "text-xs font-medium text-red-700"
                    }
                    role="status"
                  >
                    {copyStatus.message}
                  </p>
                ) : null}
              </div>
            </div>

            {editingSectionId === section.id ? (
              <div className="mt-4 grid gap-3">
                <textarea
                  className="min-h-48 w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-7 text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
                  value={draftCopy}
                  onChange={(event) => setDraftCopy(event.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-md bg-zinc-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-zinc-700"
                    onClick={() => saveEditing(section.id)}
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100"
                    onClick={cancelEditing}
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-700">
                {section.copy}
              </div>
            )}
          </section>
        ))}

        <footer className="mt-10 border-t border-zinc-100 pt-6 text-xs leading-6 text-zinc-500">
          <p>금지 표현: {product.forbiddenPhrases || "입력 없음"}</p>
          <p>내부 메모: {product.notes || "입력 없음"}</p>
        </footer>
      </div>
    </article>
  );
}
