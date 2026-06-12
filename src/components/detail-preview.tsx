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

const getHeroSubCopy = (section: DetailSection, product: ProductInfo) => {
  const productLabel = `${product.brandName} ${product.productName}`.trim();
  const candidates = section.copy
    .split(/\n{2,}|\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    candidates.find(
      (line) => line !== productLabel && line !== section.title,
    ) ||
    section.description ||
    product.usp ||
    "첫 화면에서 고객이 바로 이해할 수 있는 핵심 메시지를 배치합니다."
  );
};

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

  const scrollToUspSection = () => {
    document
      .getElementById("detail-section-usp")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const projectName = product.projectName.trim() || FALLBACK_PROJECT_NAME;
  const brandName = product.brandName.trim() || "브랜드";
  const heroProductName = product.productName.trim() || projectName;
  const productLabel =
    `${product.brandName} ${product.productName}`.trim() || projectName;

  const renderCopyStatus = (target: CopyTarget) =>
    copyStatus?.target === target ? (
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
    ) : null;

  const renderSectionActions = (section: DetailSection) => (
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
          <Button type="button" onClick={() => startEditing(section)}>
            수정
          </Button>
        ) : null}
      </div>
      {renderCopyStatus(section.id)}
    </div>
  );

  const renderSectionEditor = (section: DetailSection) =>
    editingSectionId === section.id ? (
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
          <Button type="button" onClick={cancelEditing}>
            취소
          </Button>
        </div>
      </div>
    ) : (
      <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">
        {section.copy}
      </div>
    );

  const renderHeroSection = (section: DetailSection) => {
    const heroSubCopy = getHeroSubCopy(section, product);

    return (
      <section
        key={section.id}
        id={`detail-section-${section.id}`}
        className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[var(--shadow-card-hover)]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-white px-4 py-3">
          <Caption className="pt-2 text-slate-400">Hero 관리</Caption>
          {renderSectionActions(section)}
        </div>

        <div className="bg-[linear-gradient(135deg,#0f172a_0%,#155e75_58%,#f59e0b_150%)] px-5 py-8 text-white sm:px-7 sm:py-10">
          <div className="min-w-0 [writing-mode:horizontal-tb]">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-white/25 bg-white/15 text-white" tone="neutral">
                HERO
              </Badge>
              <Badge className="border-amber-200/40 bg-amber-200/20 text-amber-50" tone="point">
                {section.kind}
              </Badge>
            </div>

            <div className="mt-7 min-w-0 max-w-none">
              <Caption className="text-sm font-semibold text-cyan-100 [word-break:keep-all]">
                {brandName}
              </Caption>
              <Headline className="mt-3 block max-w-full whitespace-normal text-3xl font-semibold leading-tight text-white [word-break:keep-all] sm:text-4xl">
                {heroProductName}
              </Headline>
              <p className="mt-5 max-w-2xl overflow-hidden whitespace-normal text-base leading-8 text-cyan-50/90 [display:-webkit-box] [word-break:keep-all] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] sm:text-lg sm:leading-9">
                {heroSubCopy}
              </p>
            </div>

            <div className="mt-8">
              <Button
                type="button"
                size="lg"
                variant="primary"
                className="min-h-12 bg-amber-300 px-6 text-base font-semibold text-slate-950 shadow-lg shadow-slate-950/20 ring-1 ring-amber-100 hover:bg-amber-200"
                onClick={scrollToUspSection}
              >
                핵심 포인트 확인하기
              </Button>
            </div>

            <div className="mt-8 rounded-lg border border-white/15 bg-white/10 p-3">
              <div className="flex min-h-36 items-center justify-center rounded-md border border-dashed border-white/25 bg-white/10">
                <Caption className="text-sm font-semibold tracking-wide text-cyan-50/70">
                  Product Image
                </Caption>
              </div>
            </div>

            <Caption className="mt-5 text-cyan-50/55">
              {projectName} · {TONE_LABELS[product.tone]} · {product.category || "미지정"}
            </Caption>
          </div>
        </div>

        <div className="border-t border-slate-100 px-5 pb-5 sm:px-7">
          {renderSectionEditor(section)}
        </div>
      </section>
    );
  };

  const renderDefaultSection = (section: DetailSection) => (
    <section
      key={section.id}
      id={`detail-section-${section.id}`}
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_10px_28px_-24px_rgb(15_23_42_/_0.55)]"
    >
      <div className="flex items-start justify-between gap-4 rounded-md border border-slate-200 border-l-4 border-l-cyan-600 bg-slate-50 px-4 py-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="info">{section.kind}</Badge>
          </div>
          <Text as="h3" className="mt-3" variant="headline">
            {section.title}
          </Text>
        </div>
        {renderSectionActions(section)}
      </div>

      {renderSectionEditor(section)}
    </section>
  );

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
              {productLabel}
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
            {renderCopyStatus("all")}
          </div>
        </div>
      </CardHeader>

      <CardBody className={cn(previewContainerClass, "grid gap-6 py-6")}>
        {sections.map((section, index) =>
          index === 0 ? renderHeroSection(section) : renderDefaultSection(section),
        )}

        <footer className="mt-10 border-t border-slate-100 pt-6 text-xs leading-6 text-slate-500">
          <p>금지 표현: {product.forbiddenPhrases || "입력 없음"}</p>
          <p>내부 메모: {product.notes || "입력 없음"}</p>
        </footer>
      </CardBody>
    </Card>
  );
}
