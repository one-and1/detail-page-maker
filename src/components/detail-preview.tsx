"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardBody, CardHeader } from "@/src/components/ui/card";
import { Caption, Headline, Text } from "@/src/components/ui/typography";
import { cn } from "@/src/lib/class-names";
import { fieldControlClass, previewContainerClass } from "@/src/lib/design-system";
import { TONE_LABELS } from "@/src/lib/tone-system";
import type { DetailSection, ProductInfo } from "@/src/types";

type Props = {
  product: ProductInfo;
  sections: DetailSection[];
  onSectionCopyChange: (sectionId: DetailSection["id"], copy: string) => void;
  onSectionRegenerate: (sectionId: DetailSection["id"]) => void | Promise<void>;
};

type CopyTarget = "all" | DetailSection["id"];
type CopyStatus = {
  kind: "success" | "error";
  target: CopyTarget;
  message: string;
} | null;

const FALLBACK_PROJECT_NAME = "새 프로젝트";

const formatSectionForCopy = (section: DetailSection) =>
  `${section.title}\n\n${section.copy.trim()}`;

const formatAllSectionsForCopy = (sections: DetailSection[]) =>
  sections.map(formatSectionForCopy).join("\n\n---\n\n");

const stripListMarker = (line: string) =>
  line.replace(/^[-*•\d.)\s]+/, "").trim();

const getContentLines = (copy: string) =>
  copy
    .split(/\n+/)
    .map((line) => stripListMarker(line.trim()))
    .filter(Boolean);

const getHeroSubCopy = (section: DetailSection, product: ProductInfo) => {
  const productLabel = `${product.brandName} ${product.productName}`.trim();
  const candidates = getContentLines(section.copy);

  return (
    candidates.find(
      (line) => line !== productLabel && line !== section.title,
    ) ||
    section.description ||
    product.usp ||
    "첫 화면에서 고객이 바로 이해할 수 있는 핵심 메시지를 배치합니다."
  );
};

type UspItem = {
  title: string;
  description: string;
};

type SpecRow = {
  label: string;
  value: string;
};

const truncateText = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;

const getShortUspTitle = (text: string) => {
  const normalizedText = text.replace(/\s+/g, " ").trim();
  const phrase = normalizedText
    .split(/(?:으로|로|에도|에서|까지|,|，|\.|!|\?)/)[0]
    .trim();

  return phrase || normalizedText;
};

const toUspItem = (line: string): UspItem => {
  const [rawTitle, ...rest] = line.split(/[:：]/);
  const colonDescription = rest.join(":").trim();

  if (colonDescription) {
    return {
      title: getShortUspTitle(rawTitle),
      description: truncateText(colonDescription, 76),
    };
  }

  const [firstSentence, ...remainingSentences] = line
    .split(/[.!?。]|[,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
  const title = getShortUspTitle(firstSentence || line);
  const description = remainingSentences.join(" ") || line;

  return {
    title,
    description: truncateText(description, 76),
  };
};

const getUspItems = (section: DetailSection, product: ProductInfo) => {
  const lines = getContentLines(section.copy).filter(
    (line) => line !== section.title,
  );
  const source = lines.length > 0 ? lines : getContentLines(product.usp);

  if (source.length > 1) {
    return source.slice(0, 4);
  }

  return (source[0] || section.description || product.usp)
    .split(/[,.·]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
};

const getUspCards = (section: DetailSection, product: ProductInfo) =>
  getUspItems(section, product).map(toUspItem);

const SPEC_LABELS = [
  "소재",
  "재질",
  "충전재",
  "사이즈",
  "색상",
  "컬러",
  "무게",
  "중량",
  "구성",
  "원산지",
  "제조국",
  "대상",
  "용도",
  "카테고리",
  "브랜드",
] as const;

const normalizeSpecLabel = (label: string) =>
  label
    .replace(/제품\s*스펙|스펙|구매\s*전\s*확인|확인하세요/gi, "")
    .trim();

const parseSpecLine = (line: string): SpecRow | null => {
  const compactLine = line.replace(/\s+/g, " ").trim();

  if (!compactLine || compactLine.length > 96) {
    return null;
  }

  const [rawLabel, ...colonRest] = compactLine.split(/[:：]/);
  const colonValue = colonRest.join(":").trim();
  const normalizedLabel = normalizeSpecLabel(rawLabel);

  if (colonValue && normalizedLabel && normalizedLabel.length <= 12) {
    return {
      label: normalizedLabel,
      value: colonValue,
    };
  }

  const matchedLabel = SPEC_LABELS.find((label) =>
    compactLine.startsWith(label),
  );

  if (matchedLabel) {
    const value = compactLine
      .slice(matchedLabel.length)
      .replace(/^[-\s/|·:：]+/, "")
      .trim();

    if (value) {
      return {
        label: matchedLabel === "컬러" ? "색상" : matchedLabel,
        value,
      };
    }
  }

  return null;
};

const getSpecRows = (section: DetailSection, product: ProductInfo) => {
  const source = [
    ...getContentLines(product.specs),
    ...getContentLines(section.copy).filter((line) => line !== section.title),
  ];
  const rows: SpecRow[] = [];
  const seenLabels = new Set<string>();

  source.forEach((line) => {
    const row = parseSpecLine(line);

    if (!row || seenLabels.has(row.label)) {
      return;
    }

    seenLabels.add(row.label);
    rows.push(row);
  });

  const fallbackRows: SpecRow[] = [
    { label: "브랜드", value: product.brandName },
    { label: "제품명", value: product.productName },
    { label: "카테고리", value: product.category },
  ].filter((row) => row.value.trim());

  return (rows.length > 0 ? rows : fallbackRows).slice(0, 8);
};

const getSpecHighlight = (rows: SpecRow[]) =>
  rows.find((row) =>
    ["소재", "재질", "충전재", "사이즈", "색상"].includes(row.label),
  );

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

  const renderManagementHeader = (section: DetailSection, label: string) => (
    <CardHeader className="flex items-start justify-between gap-3 bg-white px-4 py-3">
      <Caption className="pt-2 text-slate-400">{label}</Caption>
      {renderSectionActions(section)}
    </CardHeader>
  );

  const renderSectionEditor = (
    section: DetailSection,
    options: { hideReadOnlyCopy?: boolean } = {},
  ) => {
    if (editingSectionId !== section.id && options.hideReadOnlyCopy) {
      return null;
    }

    return editingSectionId === section.id ? (
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
  };

  const renderHeroSection = (section: DetailSection) => {
    const heroSubCopy = getHeroSubCopy(section, product);

    return (
      <Card
        as="section"
        id={`detail-section-${section.id}`}
        key={section.id}
        className="overflow-hidden"
        padding="none"
        shadow="elevated"
      >
        {renderManagementHeader(section, "Hero 관리")}

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

        <CardBody className="border-t border-slate-100 px-5 pb-5 sm:px-7">
          {renderSectionEditor(section)}
        </CardBody>
      </Card>
    );
  };

  const renderUspSection = (section: DetailSection) => {
    const uspCards = getUspCards(section, product);
    const pointTitle = uspCards[0]?.title || "가볍고 선명하게";

    return (
      <Card
        as="section"
        id={`detail-section-${section.id}`}
        key={section.id}
        className="overflow-hidden"
        padding="none"
        shadow="elevated"
      >
        {renderManagementHeader(section, "USP 관리")}

        <CardBody className="bg-white px-4 py-5 sm:px-5 lg:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="primary">USP</Badge>
            <Badge tone="point">KEY POINT</Badge>
          </div>

          <div className="mt-4">
            <Headline className="text-2xl font-semibold text-slate-950">
              {section.title}
            </Headline>
            <Caption className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {section.description}
            </Caption>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2.5">
            {uspCards.map((item, index) => (
              <div
                className="min-w-0 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-[0_12px_26px_-24px_rgb(15_23_42_/_0.7)]"
                key={`${section.id}-usp-${item.title}-${index}`}
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <div className="min-w-0">
                    <Text as="h3" className="whitespace-normal text-base font-semibold leading-6 text-slate-950 [word-break:keep-all]">
                      {item.title}
                    </Text>
                    <Text className="mt-1.5 overflow-hidden text-sm leading-6 text-slate-600 [display:-webkit-box] [word-break:keep-all] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                      {item.description}
                    </Text>
                  </div>
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-[10px] font-semibold text-slate-400">
                    {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 shadow-[0_10px_24px_-22px_rgb(180_83_9_/_0.55)]">
            <Badge tone="point">POINT</Badge>
            <Headline className="mt-2 text-lg font-semibold text-amber-950">
              {pointTitle}
            </Headline>
          </div>

          {renderSectionEditor(section, { hideReadOnlyCopy: true })}
        </CardBody>
      </Card>
    );
  };

  const renderSpecSection = (section: DetailSection) => {
    const specRows = getSpecRows(section, product);
    const highlightRow = getSpecHighlight(specRows);

    return (
      <Card
        as="section"
        id={`detail-section-${section.id}`}
        key={section.id}
        className="overflow-hidden"
        padding="none"
      >
        {renderManagementHeader(section, "Spec 관리")}

        <CardBody className="bg-white px-5 py-6 sm:px-7">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="info">SPEC</Badge>
            <Badge tone="secondary">DETAIL</Badge>
          </div>

          <div className="mt-4">
            <Headline className="text-2xl font-semibold text-slate-950">
              {section.title}
            </Headline>
            <Caption className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {section.description}
            </Caption>
          </div>

          {highlightRow ? (
            <div className="mt-5 rounded-lg border border-cyan-200 bg-cyan-50 px-5 py-4">
              <Caption className="font-semibold text-cyan-700">
                대표 스펙
              </Caption>
              <Headline className="mt-2 text-xl font-semibold text-cyan-950">
                {highlightRow.value}
              </Headline>
              <Caption className="mt-1 text-cyan-700">
                {highlightRow.label}
              </Caption>
            </div>
          ) : null}

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {specRows.map((row, index) => (
              <div
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4"
                key={`${section.id}-spec-${row.label}-${index}`}
              >
                <Caption className="font-semibold text-slate-500">
                  {row.label}
                </Caption>
                <Text className="mt-2 text-base font-semibold leading-7 text-slate-900 [word-break:keep-all]">
                  {row.value}
                </Text>
              </div>
            ))}
          </div>

          {renderSectionEditor(section, { hideReadOnlyCopy: true })}
        </CardBody>
      </Card>
    );
  };

  const renderDefaultSection = (section: DetailSection) => (
    <Card
      as="section"
      id={`detail-section-${section.id}`}
      key={section.id}
      className="overflow-hidden"
      padding="none"
    >
      {renderManagementHeader(section, `${section.kind.toUpperCase()} 관리`)}

      <CardBody className="px-5 py-5">
        <div className="rounded-md border border-slate-200 border-l-4 border-l-cyan-600 bg-slate-50 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="info">{section.kind}</Badge>
          </div>
          <Text as="h3" className="mt-3" variant="headline">
            {section.title}
          </Text>
        </div>

        {renderSectionEditor(section)}
      </CardBody>
    </Card>
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
        {sections.map((section, index) => {
          if (index === 0) {
            return renderHeroSection(section);
          }

          if (section.kind === "usp") {
            return renderUspSection(section);
          }

          if (section.kind === "spec") {
            return renderSpecSection(section);
          }

          return renderDefaultSection(section);
        })}

        <footer className="mt-10 border-t border-slate-100 pt-6 text-xs leading-6 text-slate-500">
          <p>금지 표현: {product.forbiddenPhrases || "입력 없음"}</p>
          <p>내부 메모: {product.notes || "입력 없음"}</p>
        </footer>
      </CardBody>
    </Card>
  );
}
