import type { DetailSection, ProductInfo } from "@/src/types";

type DummyGeneratorOptions = {
  generationIndex?: number;
  generationSeed?: string;
};

const toneGuide: Record<ProductInfo["tone"], string> = {
  premium: "정제된 고급감과 여백을 살린 Premium 톤",
  emotional: "일상 장면과 감정을 먼저 건드리는 Emotional 톤",
  clean: "핵심만 짧게 정리하는 Clean 톤",
  professional: "기준과 조건을 분명히 잡는 Professional 톤",
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

function buildToneDummySectionCopy({
  brandName,
  category,
  primarySpec,
  primaryUsp,
  product,
  productName,
  section,
  targetAudience,
}: {
  brandName: string;
  category: string;
  primarySpec: string;
  primaryUsp: string;
  product: ProductInfo;
  productName: string;
  section: DetailSection;
  targetAudience: string;
}) {
  switch (section.kind) {
    case "hero":
      switch (product.tone) {
        case "premium":
          return `${brandName} ${productName}\n\n${primaryUsp}, 조용히 완성되는 겨울의 선택`;
        case "emotional":
          return `추운 하루 끝에도\n\n${targetAudience}의 몸과 마음을 가볍게 감싸는 ${productName}`;
        case "clean":
          return `${productName}\n\n${primaryUsp}을 한눈에 확인하세요`;
        case "professional":
          return `${category} 선택 기준\n\n${primaryUsp}과 ${primarySpec}을 먼저 확인하세요`;
      }
    case "usp":
      switch (product.tone) {
        case "premium":
          return [
            `${productName}의 Premium USP`,
            `- ${primaryUsp}을 차분하게 담은 구성`,
            "- 매일의 착용감을 해치지 않는 절제된 설계",
            "- 오래 두고 보기 좋은 정돈된 사용감",
          ].join("\n");
        case "emotional":
          return [
            `${productName}의 Emotional USP`,
            `- 바쁜 하루에도 부담을 덜어주는 ${primaryUsp}`,
            "- 손이 자주 가는 순간을 생각한 편안함",
            "- 추위를 걱정하는 마음까지 가볍게",
          ].join("\n");
        case "clean":
          return [
            `${productName}의 Clean USP`,
            `- 핵심 장점: ${primaryUsp}`,
            `- 확인 정보: ${primarySpec}`,
            "- 선택 전 필요한 내용만 간단히",
          ].join("\n");
        case "professional":
          return [
            `${productName}의 Professional USP`,
            `- 사용 목적에 맞는 ${primaryUsp}`,
            `- 구매 전 검토할 ${primarySpec}`,
            "- 옵션, 관리, 조건을 기준별로 확인",
          ].join("\n");
      }
    case "faq":
      switch (product.tone) {
        case "premium":
          return `Q. 어떤 분위기의 상품인가요?\nA. ${primaryUsp}을 중심으로, 과하지 않게 완성도를 보여주는 상품입니다.\n\nQ. 구매 전 무엇을 보면 좋나요?\nA. ${primarySpec}과 실제 사용 환경을 함께 확인해 주세요.`;
        case "emotional":
          return `Q. 추위를 많이 타는 사람에게 괜찮을까요?\nA. ${targetAudience}이 느끼는 불편을 줄이는 방향으로 소개할 수 있습니다.\n\nQ. 매일 쓰기 부담스럽지 않을까요?\nA. ${primaryUsp}을 중심으로 일상 사용 장면에 맞춰 안내하세요.`;
        case "clean":
          return `Q. 핵심 장점은 무엇인가요?\nA. ${primaryUsp}입니다.\n\nQ. 구매 전 확인할 점은요?\nA. ${primarySpec}을 먼저 확인하세요.`;
        case "professional":
          return `Q. 어떤 기준으로 선택하면 되나요?\nA. 사용 목적, 사이즈, 관리 방식, ${primarySpec}을 기준으로 확인하세요.\n\nQ. 표현 시 주의할 점은요?\nA. 제공된 정보 밖의 효능, 보증, 정책은 단정하지 않습니다.`;
      }
    case "cta":
      switch (product.tone) {
        case "premium":
          return `${brandName} ${productName}\n\n서두르지 않고, 나에게 맞는 구성부터 확인하세요.`;
        case "emotional":
          return `내일의 외출이 조금 더 가볍도록\n\n지금 필요한 옵션을 천천히 골라보세요.`;
        case "clean":
          return `${productName} 구매 전 확인\n\n옵션과 구성 정보를 확인하세요.`;
        case "professional":
          return `${category} 구매 체크\n\n사이즈, 구성, 사용 조건을 확인한 뒤 선택하세요.`;
      }
    case "spec":
    case "comparison":
      return null;
  }
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
    case "usp":
    case "faq":
    case "cta": {
      const toneCopy = buildToneDummySectionCopy({
        brandName,
        category,
        primarySpec,
        primaryUsp,
        product,
        productName,
        section,
        targetAudience,
      });

      return `${toneCopy ?? ""}\n\n${copyAngle} ${tone}`;
    }
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
  }
}
