"use client";

import Image from "next/image";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardBody, CardHeader } from "@/src/components/ui/card";
import { Caption, Headline, Text } from "@/src/components/ui/typography";
import { cn } from "@/src/lib/class-names";
import { fieldControlClass, previewContainerClass } from "@/src/lib/design-system";
import { TONE_LABELS } from "@/src/lib/tone-system";
import type { DetailSection, ProductImageAsset, ProductInfo } from "@/src/types";

type Props = {
  product: ProductInfo;
  productImage: ProductImageAsset | null;
  sections: DetailSection[];
  onProductImageUpload: (file: File) => void;
  onSectionCopyChange: (sectionId: DetailSection["id"], copy: string) => void;
  onSectionRegenerate: (sectionId: DetailSection["id"]) => void | Promise<void>;
};

type CopyTarget = "all" | DetailSection["id"];
type CopyStatus = {
  kind: "success" | "error";
  target: CopyTarget;
  message: string;
} | null;

const previewSectionCardClass = "overflow-hidden";
const previewSectionBodyClass = "bg-white px-5 py-6 sm:px-7";
const previewGradientClass =
  "bg-[linear-gradient(135deg,#0f172a_0%,#155e75_58%,#f59e0b_150%)]";
const previewBadgeRowClass = "flex flex-wrap items-center gap-2";
const previewIntroClass = "mt-4";
const previewHeadingClass = "text-2xl font-semibold leading-tight text-slate-950";
const previewDescriptionClass = "mt-2 max-w-2xl text-sm leading-6 text-slate-500";
const previewItemGridClass = "mt-5 grid gap-3";
const previewItemCardClass =
  "min-w-0 rounded-lg border border-slate-200 shadow-[0_12px_26px_-24px_rgb(15_23_42_/_0.7)]";
const previewPointCardClass =
  "mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 shadow-[0_10px_24px_-22px_rgb(180_83_9_/_0.55)]";
const previewPrimaryCtaClass =
  "min-h-12 bg-amber-300 px-6 text-base font-semibold text-slate-950 shadow-lg shadow-slate-950/20 ring-1 ring-amber-100 hover:bg-amber-200";

const FALLBACK_PROJECT_NAME = "새 프로젝트";

const normalizeCopyText = (text: string) =>
  text
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const joinCopyBlocks = (blocks: Array<string | null | undefined>) =>
  normalizeCopyText(blocks.map((block) => block?.trim()).filter(Boolean).join("\n\n"));

const formatPreviewSectionForCopy = (
  section: DetailSection,
  product: ProductInfo,
  index: number,
) => {
  if (index === 0) {
    const brandName = product.brandName.trim() || "브랜드";
    const projectName = product.projectName.trim() || FALLBACK_PROJECT_NAME;
    const heroProductName = product.productName.trim() || projectName;

    return joinCopyBlocks([
      brandName,
      heroProductName,
      getHeroSubCopy(section, product),
    ]);
  }

  if (section.kind === "usp") {
    const uspCards = getUspCards(section, product);
    const pointTitle = uspCards[0]?.title || "가볍고 선명하게";

    return joinCopyBlocks([
      section.title,
      section.description,
      uspCards
        .map((item) => `${item.title}\n${item.description}`)
        .join("\n\n"),
      pointTitle,
    ]);
  }

  if (section.kind === "spec") {
    const specRows = getSpecRows(section, product);
    const highlightRow = getSpecHighlight(specRows);

    return joinCopyBlocks([
      section.title,
      section.description,
      highlightRow ? `${highlightRow.label}\n${highlightRow.value}` : null,
      specRows.map((row) => `${row.label}: ${row.value}`).join("\n"),
    ]);
  }

  if (section.kind === "comparison") {
    const compare = getCompareContent(section, product);

    return joinCopyBlocks([
      section.title,
      section.description,
      `${compare.before.heading}\n${compare.before.keywords.join("\n")}`,
      `${compare.after.heading}\n${compare.after.keywords.join("\n")}`,
      compare.point,
    ]);
  }

  if (section.kind === "faq") {
    const faqItems = getFaqItems(section, product);

    return joinCopyBlocks([
      section.title,
      section.description,
      faqItems
        .map((item) => `Q. ${item.question}\nA. ${item.answer}`)
        .join("\n\n"),
    ]);
  }

  if (section.kind === "cta") {
    const brandName = product.brandName.trim() || "브랜드";
    const cta = getCtaContent(section, product);

    return joinCopyBlocks([
      brandName,
      cta.subCopy,
      cta.buttonLabel,
      cta.note,
    ]);
  }

  return joinCopyBlocks([section.title, section.copy]);
};

const formatAllSectionsForCopy = (
  sections: DetailSection[],
  product: ProductInfo,
) =>
  sections
    .map((section, index) => formatPreviewSectionForCopy(section, product, index))
    .join("\n\n---\n\n");

const stripListMarker = (line: string) =>
  line.replace(/^[-*•\d.)\s]+/, "").trim();

const getContentLines = (copy: string) =>
  copy
    .split(/\n+/)
    .map((line) => stripListMarker(line.trim()))
    .filter(Boolean);

const getHeroSubCopy = (section: DetailSection, product: ProductInfo) => {
  const productLabel = `${product.brandName} ${product.productName}`.trim();
  const productName = product.productName.trim();
  const candidates = getContentLines(section.copy);

  return (
    candidates.find(
      (line) =>
        line !== productLabel &&
        line !== productName &&
        line !== section.title,
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

type CompareItem = {
  label: string;
  heading: string;
  keywords: string[];
};

type CompareContent = {
  before: CompareItem;
  after: CompareItem;
  point: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type CtaContent = {
  subCopy: string;
  buttonLabel: string;
  note: string;
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
  const description = remainingSentences.join(" ");

  return {
    title,
    description: truncateText(description, 76),
  };
};

const getUspItems = (section: DetailSection, product: ProductInfo) => {
  const lines = getContentLines(section.copy).filter(
    (line) =>
      line !== section.title &&
      line !== "이 상품의 핵심 포인트" &&
      line !== "핵심 포인트",
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

const splitCompareSentences = (copy: string) =>
  copy
    .split(/[\n.!?。]+/)
    .map((line) => stripListMarker(line.trim()))
    .filter(Boolean);

const normalizeCompareKeyword = (text: string) => {
  const compactText = text
    .replace(/이번 더미 초안은|더미|섹션|입니다|합니다|보여줍니다/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const keyword = compactText
    .split(/(?:은|는|이|가|을|를|에게|에도|에서|으로|로|,|，| 때문에| 대신| 기준으로)/)[0]
    .trim();

  return truncateText(keyword || compactText, 16);
};

const getCompareKeywords = ({
  fallbackItems,
  lines,
  pattern,
}: {
  fallbackItems: string[];
  lines: string[];
  pattern: RegExp;
}) => {
  const matchedItems = lines
    .filter((line) => pattern.test(line))
    .flatMap((line) => line.split(/[,，/|·]/))
    .map(normalizeCompareKeyword)
    .filter((item) => item.length >= 2);
  const uniqueItems = [...matchedItems, ...fallbackItems].filter(
    (item, index, items) => item && items.indexOf(item) === index,
  );

  return uniqueItems.slice(0, 4);
};

const getCompareContent = (
  section: DetailSection,
  product: ProductInfo,
): CompareContent => {
  const lines = splitCompareSentences(section.copy).filter(
    (line) => line !== section.title,
  );
  const productName = product.productName.trim() || "이 제품";
  const primaryUsp =
    getContentLines(product.usp)[0] || "선택 기준이 분명한 사용감";
  const beforeKeywords = getCompareKeywords({
    lines,
    pattern: /기존|문제|불편|부담|애매|고민|어려|답답|무거/,
    fallbackItems: ["선택 기준 애매", "불편한 사용감", "관리 부담"],
  });
  const afterKeywords = getCompareKeywords({
    lines: [...getContentLines(product.usp), ...getContentLines(product.specs), ...lines],
    pattern: /해결|대신|우리|제품|상품|가능|가벼|편한|방수|분리|관리|보온|활동/,
    fallbackItems: [
      normalizeCompareKeyword(primaryUsp),
      productName,
      product.category ? `${product.category} 맞춤` : "쉬운 선택",
    ],
  });
  const pointSource =
    afterKeywords[0] || normalizeCompareKeyword(primaryUsp) || productName;

  return {
    before: {
      label: "BEFORE",
      heading: "기존 방식",
      keywords: beforeKeywords,
    },
    after: {
      label: "AFTER",
      heading: "우리 제품",
      keywords: afterKeywords,
    },
    point: `${pointSource}으로 선택 이유를 명확하게`,
  };
};

const cleanFaqLine = (line: string) =>
  stripListMarker(line)
    .replace(/^(?:Q|질문)\s*[.)：:]\s*/i, "")
    .replace(/^(?:A|답변)\s*[.)：:]\s*/i, "")
    .trim();

const getFaqItems = (
  section: DetailSection,
  product: ProductInfo,
): FaqItem[] => {
  const lines = getContentLines(section.copy);
  const items: FaqItem[] = [];
  let currentQuestion = "";

  lines.forEach((line) => {
    if (/^(?:Q|질문)\s*[.)：:]/i.test(line)) {
      currentQuestion = cleanFaqLine(line);
      return;
    }

    if (/^(?:A|답변)\s*[.)：:]/i.test(line)) {
      const answer = cleanFaqLine(line);

      if (currentQuestion && answer) {
        items.push({
          question: truncateText(currentQuestion, 54),
          answer: truncateText(answer, 92),
        });
        currentQuestion = "";
      }
    }
  });

  const fallbackItems: FaqItem[] = [
    {
      question: "어떤 고객에게 적합한가요?",
      answer: `${product.targetAudience || "주요 고객"}에게 맞춘 사용 상황을 제안합니다.`,
    },
    {
      question: "구매 전 무엇을 확인하면 좋나요?",
      answer: product.specs
        ? truncateText(getContentLines(product.specs)[0] || product.specs, 92)
        : "옵션, 구성, 사용 조건을 먼저 확인해 주세요.",
    },
    {
      question: "핵심 장점은 무엇인가요?",
      answer: product.usp
        ? truncateText(getContentLines(product.usp)[0] || product.usp, 92)
        : "상품의 핵심 포인트를 짧게 확인할 수 있습니다.",
    },
  ];

  return [...items, ...fallbackItems]
    .filter(
      (item, index, source) =>
        item.question &&
        item.answer &&
        source.findIndex((candidate) => candidate.question === item.question) ===
          index,
    )
    .slice(0, 4);
};

const getCtaContent = (
  section: DetailSection,
  product: ProductInfo,
): CtaContent => {
  const productName = product.productName.trim() || "이 제품";

  return {
    subCopy: `${productName}을 지금 편하게 경험해보세요`,
    buttonLabel: "구매하기",
    note: "옵션 선택 후 구매 가능합니다.",
  };
};

export function DetailPreview({
  product,
  productImage,
  sections,
  onProductImageUpload,
  onSectionCopyChange,
  onSectionRegenerate,
}: Props) {
  const [selectedSectionId, setSelectedSectionId] = useState<
    DetailSection["id"] | null
  >(sections[0]?.id ?? null);
  const [editingSectionId, setEditingSectionId] = useState<
    DetailSection["id"] | null
  >(null);
  const [draftCopy, setDraftCopy] = useState("");
  const [copyStatus, setCopyStatus] = useState<CopyStatus>(null);
  const copyMessageTimeoutRef = useRef<number | null>(null);
  const productImageInputRef = useRef<HTMLInputElement | null>(null);

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
    setSelectedSectionId(section.id);
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

  const openProductImagePicker = () => {
    productImageInputRef.current?.click();
  };

  const handleProductImageInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    onProductImageUpload(file);
    event.target.value = "";
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
  const selectedSectionIndex = sections.findIndex(
    (section) => section.id === selectedSectionId,
  );
  const selectedSection =
    (selectedSectionIndex >= 0 ? sections[selectedSectionIndex] : sections[0]) ??
    null;

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

  const renderPreviewToolbar = () => (
    <CardHeader className="border-b border-slate-200 bg-white px-4 py-4 sm:px-5">
      <div className="grid gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className={previewBadgeRowClass}>
              <Badge tone="neutral">PREVIEW TOOLBAR</Badge>
              <Badge tone="point">{sections.length} SECTIONS</Badge>
            </div>
            <Caption className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              {productLabel} · {projectName} · {product.category}
            </Caption>
            <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">
              <Caption className="text-slate-500">선택 섹션</Caption>
              <Badge tone="primary" className="max-w-full truncate">
                {selectedSection?.title ?? "섹션 없음"}
              </Badge>
            </div>
          </div>

          <div className="flex min-w-0 flex-col items-start gap-2 lg:items-end">
            <div className="flex flex-wrap gap-2">
              <input
                ref={productImageInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleProductImageInputChange}
              />
              <Button
                type="button"
                size="md"
                onClick={openProductImagePicker}
              >
                Upload image
              </Button>
              <Button
                type="button"
                size="md"
                variant="primary"
                onClick={() => copyText(formatAllSectionsForCopy(sections, product), "all")}
              >
                전체 복사
              </Button>
              <Button
                type="button"
                size="md"
                disabled={!selectedSection}
                onClick={() =>
                  selectedSection
                    ? copyText(
                        formatPreviewSectionForCopy(
                          selectedSection,
                          product,
                          selectedSectionIndex >= 0 ? selectedSectionIndex : 0,
                        ),
                        selectedSection.id,
                      )
                    : undefined
                }
              >
                섹션 복사
              </Button>
              <Button
                type="button"
                size="md"
                disabled={!selectedSection}
                onClick={() =>
                  selectedSection ? regenerateSection(selectedSection.id) : undefined
                }
              >
                다시 생성
              </Button>
              {selectedSection && editingSectionId !== selectedSection.id ? (
                <Button
                  type="button"
                  size="md"
                  disabled={!selectedSection}
                  onClick={() => startEditing(selectedSection)}
                >
                  수정
                </Button>
              ) : null}
            </div>
            {renderCopyStatus("all")}
            {selectedSection ? renderCopyStatus(selectedSection.id) : null}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {sections.map((section) => {
            const isSelected = section.id === selectedSection?.id;

            return (
              <Button
                type="button"
                key={`preview-toolbar-${section.id}`}
                variant={isSelected ? "primary" : "secondary"}
                className="whitespace-nowrap"
                onClick={() => setSelectedSectionId(section.id)}
              >
                {section.kind.toUpperCase()}
              </Button>
            );
          })}
        </div>
      </div>
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
        className={previewSectionCardClass}
        padding="none"
        shadow="elevated"
      >
        <div className={cn(previewGradientClass, "px-5 py-8 text-white sm:px-7 sm:py-10")}>
          <div className="min-w-0 [writing-mode:horizontal-tb]">
            <div className={previewBadgeRowClass}>
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
                className={previewPrimaryCtaClass}
                onClick={scrollToUspSection}
              >
                핵심 포인트 확인하기
              </Button>
            </div>

            <div className="mt-8 rounded-lg border border-white/15 bg-white/10 p-3">
              {productImage ? (
                <div className="relative aspect-square overflow-hidden rounded-md border border-white/20 bg-white/10">
                  <Image
                    src={productImage.dataUrl}
                    alt={`${heroProductName} product image`}
                    fill
                    sizes="(min-width: 1280px) 704px, (min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex aspect-square min-h-36 flex-col items-center justify-center rounded-md border border-dashed border-white/25 bg-white/10 px-4 text-center">
                  <Caption className="text-sm font-semibold tracking-wide text-cyan-50/80">
                    Upload image
                  </Caption>
                  <Caption className="mt-2 text-xs leading-5 text-cyan-50/60">
                    1:1 square recommended
                  </Caption>
                </div>
              )}
            </div>

            <Caption className="mt-5 text-cyan-50/55">
              {projectName} · {TONE_LABELS[product.tone]} · {product.category || "미지정"}
            </Caption>
          </div>
        </div>

        {editingSectionId === section.id ? (
          <CardBody className="border-t border-slate-100 px-5 pb-5 sm:px-7">
            {renderSectionEditor(section, { hideReadOnlyCopy: true })}
          </CardBody>
        ) : null}
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
        className={previewSectionCardClass}
        padding="none"
        shadow="elevated"
      >
        <CardBody className={previewSectionBodyClass}>
          <div className={previewBadgeRowClass}>
            <Badge tone="primary">USP</Badge>
            <Badge tone="point">KEY POINT</Badge>
          </div>

          <div className={previewIntroClass}>
            <Headline className={previewHeadingClass}>
              {section.title}
            </Headline>
            <Caption className={previewDescriptionClass}>
              {section.description}
            </Caption>
          </div>

          <div className={cn(previewItemGridClass, "grid-cols-1")}>
            {uspCards.map((item, index) => (
              <div
                className={cn(previewItemCardClass, "bg-white px-4 py-4")}
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

          <div className={previewPointCardClass}>
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
        className={previewSectionCardClass}
        padding="none"
      >
        <CardBody className={previewSectionBodyClass}>
          <div className={previewBadgeRowClass}>
            <Badge tone="info">SPEC</Badge>
            <Badge tone="secondary">DETAIL</Badge>
          </div>

          <div className={previewIntroClass}>
            <Headline className={previewHeadingClass}>
              {section.title}
            </Headline>
            <Caption className={previewDescriptionClass}>
              {section.description}
            </Caption>
          </div>

          {highlightRow ? (
            <div className="mt-5 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-4 shadow-[0_12px_26px_-24px_rgb(8_145_178_/_0.55)]">
              <Caption className="font-semibold text-cyan-700">
                대표 스펙
              </Caption>
              <Headline className="mt-2 text-lg font-semibold text-cyan-950">
                {highlightRow.value}
              </Headline>
              <Caption className="mt-1 text-cyan-700">
                {highlightRow.label}
              </Caption>
            </div>
          ) : null}

          <div className={cn(previewItemGridClass, "md:grid-cols-2")}>
            {specRows.map((row, index) => (
              <div
                className={cn(previewItemCardClass, "bg-slate-50 px-4 py-4")}
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

  const renderCompareSection = (section: DetailSection) => {
    const compare = getCompareContent(section, product);

    return (
      <Card
        as="section"
        id={`detail-section-${section.id}`}
        key={section.id}
        className={previewSectionCardClass}
        padding="none"
        shadow="elevated"
      >
        <CardBody className={cn(previewSectionBodyClass, "@container")}>
          <div className={previewBadgeRowClass}>
            <Badge tone="primary">COMPARE</Badge>
            <Badge tone="point">WHY THIS</Badge>
          </div>

          <div className={previewIntroClass}>
            <Headline className={previewHeadingClass}>
              {section.title}
            </Headline>
            <Caption className={previewDescriptionClass}>
              {section.description}
            </Caption>
          </div>

          <div className={cn(previewItemGridClass, "grid-cols-1 @min-[720px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] @min-[720px]:items-stretch")}>
            {[compare.before, compare.after].map((item, index) => (
              <div
                className={cn(
                  "min-w-0 rounded-lg border px-4 py-4 shadow-[0_12px_26px_-24px_rgb(15_23_42_/_0.7)]",
                  index === 0
                    ? "border-slate-200 bg-slate-50 @min-[720px]:order-1"
                    : "border-cyan-200 bg-cyan-50 @min-[720px]:order-3",
                )}
                key={`${section.id}-compare-${item.label}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <Badge tone={index === 0 ? "secondary" : "primary"}>
                    {item.label}
                  </Badge>
                  <Caption className="text-xs font-semibold text-slate-500">
                    {item.heading}
                  </Caption>
                </div>

                <div className="mt-4 grid gap-2">
                  {item.keywords.map((keyword) => (
                    <div
                      className={cn(
                        "flex min-h-11 items-center rounded-md border bg-white px-3 text-sm font-semibold leading-5 text-slate-900 [word-break:keep-all]",
                        index === 0 ? "border-slate-200" : "border-cyan-200",
                      )}
                      key={`${section.id}-${item.label}-${keyword}`}
                    >
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="hidden @min-[720px]:order-2 @min-[720px]:flex @min-[720px]:items-center @min-[720px]:justify-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-500 shadow-[0_10px_24px_-22px_rgb(15_23_42_/_0.65)]">
                VS
              </span>
            </div>
          </div>

          <div className={previewPointCardClass}>
            <div className="grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
              <Badge tone="point">POINT</Badge>
              <Text className="text-sm font-semibold leading-6 text-amber-950 [word-break:keep-all]">
                {compare.point}
              </Text>
            </div>
          </div>

          {renderSectionEditor(section, { hideReadOnlyCopy: true })}
        </CardBody>
      </Card>
    );
  };

  const renderFaqSection = (section: DetailSection) => {
    const faqItems = getFaqItems(section, product);

    return (
      <Card
        as="section"
        id={`detail-section-${section.id}`}
        key={section.id}
        className={previewSectionCardClass}
        padding="none"
        shadow="elevated"
      >
        <CardBody className={previewSectionBodyClass}>
          <div className={previewBadgeRowClass}>
            <Badge tone="info">FAQ</Badge>
            <Badge tone="secondary">Q&A</Badge>
          </div>

          <div className={previewIntroClass}>
            <Headline className={previewHeadingClass}>
              {section.title}
            </Headline>
            <Caption className={previewDescriptionClass}>
              {section.description}
            </Caption>
          </div>

          <div className={previewItemGridClass}>
            {faqItems.map((item, index) => (
              <div
                className={cn(previewItemCardClass, "bg-slate-50 px-4 py-4")}
                key={`${section.id}-faq-${item.question}-${index}`}
              >
                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md border border-cyan-200 bg-cyan-50 text-xs font-semibold text-cyan-700">
                    Q
                  </span>
                  <Text
                    as="h3"
                    className="pt-0.5 text-base font-semibold leading-6 text-slate-950 [word-break:keep-all]"
                  >
                    {item.question}
                  </Text>
                </div>

                <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-md border border-slate-200 bg-white px-3 py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md border border-amber-200 bg-amber-50 text-xs font-semibold text-amber-700">
                    A
                  </span>
                  <Text className="overflow-hidden text-sm leading-6 text-slate-700 [display:-webkit-box] [word-break:keep-all] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                    {item.answer}
                  </Text>
                </div>
              </div>
            ))}
          </div>

          {renderSectionEditor(section, { hideReadOnlyCopy: true })}
        </CardBody>
      </Card>
    );
  };

  const renderCtaSection = (section: DetailSection) => {
    const cta = getCtaContent(section, product);

    return (
      <Card
        as="section"
        id={`detail-section-${section.id}`}
        key={section.id}
        className={previewSectionCardClass}
        padding="none"
        shadow="elevated"
      >
        <CardBody className={cn(previewGradientClass, "px-5 py-10 text-center text-white sm:px-7 sm:py-12")}>
          <div className={cn(previewBadgeRowClass, "justify-center")}>
            <Badge className="border-white/25 bg-white/15 text-white" tone="neutral">
              CTA
            </Badge>
            <Badge className="border-amber-200/40 bg-amber-200/20 text-amber-50" tone="point">
              FINAL STEP
            </Badge>
          </div>

          <div className="mx-auto mt-5 max-w-md">
            <Caption className="text-sm font-semibold text-cyan-100 [word-break:keep-all]">
              {brandName}
            </Caption>
            <Text className="mx-auto mt-3 text-sm font-semibold leading-6 text-white [word-break:keep-all] sm:text-base">
              {cta.subCopy}
            </Text>
          </div>

          <div className="mx-auto mt-8 max-w-lg">
            <Button
              type="button"
              size="lg"
              variant="primary"
              className="min-h-16 w-full bg-amber-300 px-8 text-xl font-semibold text-slate-950 shadow-lg shadow-slate-950/30 ring-1 ring-amber-100 hover:bg-amber-200 sm:min-h-20 sm:px-10 sm:text-2xl"
            >
              {cta.buttonLabel}
            </Button>
            <Caption className="mt-5 text-sm font-semibold text-white [word-break:keep-all]">
              {cta.note}
            </Caption>
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
      className={previewSectionCardClass}
      padding="none"
    >
      <CardBody className={previewSectionBodyClass}>
        <div className="rounded-md border border-slate-200 border-l-4 border-l-cyan-600 bg-slate-50 px-4 py-3">
          <div className={previewBadgeRowClass}>
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
      {renderPreviewToolbar()}

      <CardBody className={cn(previewContainerClass, "grid gap-5 py-5 sm:gap-6 sm:py-6")}>
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

          if (section.kind === "comparison") {
            return renderCompareSection(section);
          }

          if (section.kind === "faq") {
            return renderFaqSection(section);
          }

          if (section.kind === "cta") {
            return renderCtaSection(section);
          }

          return renderDefaultSection(section);
        })}

        <footer className="mt-4 border-t border-slate-100 pt-5 text-xs leading-6 text-slate-500 sm:mt-6">
          <p>금지 표현: {product.forbiddenPhrases || "입력 없음"}</p>
          <p>내부 메모: {product.notes || "입력 없음"}</p>
        </footer>
      </CardBody>
    </Card>
  );
}
