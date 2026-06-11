"use client";

import { useEffect, useRef, useState } from "react";
import { TONE_LABELS } from "@/src/lib/tone-system";
import type { DetailSection, ProductInfo } from "@/src/types";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardBody, CardHeader } from "@/src/components/ui/card";
import { Caption, Headline, Text } from "@/src/components/ui/typography";
import { cn } from "@/src/lib/class-names";
import { fieldControlClass, previewContainerClass } from "@/src/lib/design-system";

type Props = {
  product: ProductInfo;
  sections: DetailSection[];
  onSectionCopyChange: (sectionId: DetailSection["id"], copy: string) => void;
  onSectionRegenerate: (sectionId: DetailSection["id"]) => void | Promise<void>;
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
  onSectionRegenerate,
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

  const regenerateSection = (sectionId: DetailSection["id"]) => {
    onSectionRegenerate(sectionId);

    if (editingSectionId === sectionId) {
      cancelEditing();
    }
  };

  const projectName = product.projectName.trim() || FALLBACK_PROJECT_NAME;

  return (
    <Card as="article" className="min-w-0 overflow-hidden rounded-lg" padding="none">
      <CardHeader className="border-b-0 bg-[linear-gradient(135deg,#0f172a_0%,#155e75_58%,#f59e0b_145%)] px-6 py-7 text-white">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-white/25 bg-white/15 text-white" tone="neutral">
                PREVIEW
              </Badge>
              <Badge className="border-amber-200/40 bg-amber-200/20 text-amber-50" tone="point">
                {sections.length} SECTIONS
              </Badge>
              <Badge className="border-cyan-100/30 bg-cyan-100/15 text-cyan-50" tone="info">
                {TONE_LABELS[product.tone]}
              </Badge>
            </div>
            <Headline className="mt-4 text-2xl font-semibold text-white">
              {product.brandName} {product.productName}
            </Headline>
            <Caption className="mt-2 max-w-xl text-sm leading-6 text-cyan-50/85">
              {projectName} · {product.category}
            </Caption>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <Button
              type="button"
              size="lg"
              variant="primary"
              onClick={() => copyText(formatAllSectionsForCopy(sections), "all")}
            >
              전체 복사
            </Button>
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
      </CardHeader>

      <CardBody className={cn(previewContainerClass, "grid gap-6 py-6")}>
        {sections.map((section, index) => (
          <section
            key={section.id}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_10px_28px_-24px_rgb(15_23_42_/_0.55)]"
          >
            <div className="flex items-start justify-between gap-4 rounded-md border border-slate-200 border-l-4 border-l-cyan-600 bg-slate-50 px-4 py-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={index === 0 ? "hot" : "info"}>{section.kind}</Badge>
                  {index === 0 ? <Badge tone="new">HERO</Badge> : null}
                </div>
                <Text as="h3" className="mt-3" variant="headline">
                  {section.title}
                </Text>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <div className="flex flex-wrap justify-end gap-2">
                  <Button
                    type="button"
                    onClick={() => copyText(formatSectionForCopy(section), section.id)}
                  >
                    복사
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => regenerateSection(section.id)}
                  >
                    다시 생성
                  </Button>
                  {editingSectionId !== section.id ? (
                    <Button
                      type="button"
                      onClick={() => startEditing(section)}
                    >
                      수정
                    </Button>
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
              <div className="mt-5 grid gap-3">
                <textarea
                  className={cn(fieldControlClass, "min-h-48 resize-y leading-7")}
                  value={draftCopy}
                  onChange={(event) => setDraftCopy(event.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => saveEditing(section.id)}
                  >
                    저장
                  </Button>
                  <Button
                    type="button"
                    onClick={cancelEditing}
                  >
                    취소
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {section.copy}
              </div>
            )}
          </section>
        ))}

        <footer className="mt-10 border-t border-slate-100 pt-6 text-xs leading-6 text-slate-500">
          <p>금지 표현: {product.forbiddenPhrases || "입력 없음"}</p>
          <p>내부 메모: {product.notes || "입력 없음"}</p>
        </footer>
      </CardBody>
    </Card>
  );
}
