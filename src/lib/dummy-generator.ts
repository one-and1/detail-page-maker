import type { DetailSection, ProductInfo } from "@/src/types";

type DummyGeneratorOptions = {
  generationIndex?: number;
  generationSeed?: string;
};

const toneGuide: Record<ProductInfo["tone"], string> = {
  clear: "핵심 정보를 먼저 보여주는 명확한 톤",
  friendly: "부담 없이 읽히는 친근한 톤",
  premium: "정돈되고 신뢰감 있는 프리미엄 톤",
  minimal: "군더더기 없이 짧고 절제된 톤",
};

const fallback = (value: string, fallbackValue: string) =>
  value.trim() || fallbackValue;

const firstFilledLine = (value: string, fallbackValue: string) =>
  value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .find(Boolean) || fallbackValue;

const bulletLines = (value: string, fallbackItems: string[]) => {
  const items = value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (items.length > 0 ? items : fallbackItems)
    .slice(0, 4)
    .map((item) => `- ${item}`)
    .join("\n");
};

const variationSets = {
  heroFocus: [
    "첫 화면에서 사용 장면과 기대감을 빠르게 연결합니다.",
    "도입부에서 필요한 이유와 선택 포인트를 자연스럽게 묶어 보여줍니다.",
    "상단 영역에서 상품의 쓰임과 핵심 장점을 차분하게 전달합니다.",
  ],
  uspIntro: [
    "구매자가 바로 확인하기 좋은 핵심 장점입니다.",
    "상세페이지 중반에서 반복 강조하기 좋은 포인트입니다.",
    "선택 전에 비교하기 좋은 차별화 문장입니다.",
  ],
  specIntro: [
    "구매 전에 확인할 정보를 간단히 정리합니다.",
    "실제 판매 정보로 교체하기 쉬운 확인 항목입니다.",
    "옵션과 구성 검수에 맞춰 다듬기 좋은 기본 문장입니다.",
  ],
  comparisonClose: [
    "사용 상황, 관리 방식, 선택 기준을 나눠 보여주는 더미 문제 해결 섹션입니다.",
    "과장 없이 비교 기준을 좁혀 구매 판단을 돕는 더미 비교 섹션입니다.",
    "고객이 헷갈리기 쉬운 기준을 정리하는 더미 안내 섹션입니다.",
  ],
  faqAnswer: [
    "판매 조건에 맞게 세부 답변을 조정합니다.",
    "최종 검수 단계에서 옵션과 안내 문구를 맞춥니다.",
    "상담 문의가 줄어들도록 확인 항목을 먼저 보여줍니다.",
  ],
  ctaClose: [
    "금지 표현은 제외하고 선택을 돕는 문장으로 마무리합니다.",
    "구매 전 확인 흐름을 유지한 채 차분하게 마무리합니다.",
    "상품 특성과 조건을 다시 확인하도록 안내하며 마무리합니다.",
  ],
  copyAngleSubject: [
    "사용 상황",
    "구매 전 확인",
    "비교 기준",
    "관리 편의",
    "선택 이유",
    "첫인상",
    "실사용 흐름",
    "정보 정리",
  ],
  copyAngleStyle: [
    "중심으로",
    "관점에서",
    "흐름에 맞춰",
    "포인트로",
    "맥락에 맞게",
    "기준으로",
    "순서로",
    "방향으로",
  ],
} satisfies Record<string, string[]>;

function hashSeed(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 31);
  }

  return hash >>> 0;
}

function pickVariation(items: string[], seed: string, salt: string) {
  return items[hashSeed(`${seed}:${salt}`) % items.length];
}

function getCopyAngle(index: number, seed: string) {
  const subject =
    variationSets.copyAngleSubject[index % variationSets.copyAngleSubject.length];
  const style = pickVariation(variationSets.copyAngleStyle, seed, "copy-angle");

  return `이번 더미 초안은 ${subject} ${style} 문장을 변형했습니다.`;
}

export function generateDummySectionCopy(
  product: ProductInfo,
  section: DetailSection,
  options: DummyGeneratorOptions = {},
) {
  const brandName = fallback(product.brandName, "브랜드");
  const productName = fallback(product.productName, "상품");
  const category = fallback(product.category, "카테고리");
  const targetAudience = fallback(product.targetAudience, "주요 고객");
  const primaryUsp = firstFilledLine(product.usp, "매일 쓰기 좋은 실용성");
  const primarySpec = firstFilledLine(product.specs, "기본 구성 정보");
  const tone = toneGuide[product.tone];
  const variationSeed =
    options.generationSeed ??
    `${product.productName}:${section.kind}:${new Date().toISOString()}`;
  const copyAngle = getCopyAngle(options.generationIndex ?? 0, variationSeed);

  switch (section.kind) {
    case "hero":
      return `${brandName} ${productName}\n\n${targetAudience}을 위해 ${primaryUsp}을 먼저 보여주는 더미 히어로 카피입니다. ${copyAngle} ${tone}으로 ${pickVariation(
        variationSets.heroFocus,
        variationSeed,
        section.kind,
      )}`;
    case "usp":
      return `${productName}의 더미 USP\n${pickVariation(
        variationSets.uspIntro,
        variationSeed,
        section.kind,
      )} ${copyAngle}\n${bulletLines(product.usp, [
        "고객이 바로 이해할 수 있는 핵심 장점",
        "상세페이지 상단에서 반복하기 좋은 메시지",
        "구매 전 확인해야 할 차별점",
      ])}`;
    case "spec":
      return `${category} 구매 전 확인 정보\n${pickVariation(
        variationSets.specIntro,
        variationSeed,
        section.kind,
      )} ${copyAngle}\n${bulletLines(product.specs, [
        primarySpec,
        "옵션과 구성은 실제 판매 정보에 맞춰 교체",
        "배송/사용 조건은 최종 검수 단계에서 확인",
      ])}`;
    case "comparison":
      return `기존 선택지가 애매했던 ${targetAudience}에게 ${productName}은 ${primaryUsp}을 기준으로 비교 포인트를 잡아줍니다.\n\n${copyAngle} 불필요한 과장 대신 ${pickVariation(
        variationSets.comparisonClose,
        variationSeed,
        section.kind,
      )}`;
    case "faq":
      return `Q. ${productName}은 어떤 고객에게 맞나요?\nA. ${targetAudience}에게 맞춰 소개하는 더미 답변입니다. ${copyAngle}\n\nQ. 구매 전 무엇을 확인해야 하나요?\nA. ${primarySpec}을 먼저 확인하고, ${pickVariation(
        variationSets.faqAnswer,
        variationSeed,
        section.kind,
      )}`;
    case "cta":
      return `${brandName} ${productName} 구매 안내\n\n${category} 상품 특성에 맞춰 옵션, 구성, 사용 목적을 확인한 뒤 선택하도록 안내합니다. ${copyAngle} ${tone}으로 ${pickVariation(
        variationSets.ctaClose,
        variationSeed,
        section.kind,
      )}`;
  }
}
