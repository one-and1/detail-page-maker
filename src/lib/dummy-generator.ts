import type { DetailSection, ProductInfo } from "@/src/types";

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

export function generateDummySectionCopy(
  product: ProductInfo,
  section: DetailSection,
) {
  const brandName = fallback(product.brandName, "브랜드");
  const productName = fallback(product.productName, "상품");
  const category = fallback(product.category, "카테고리");
  const targetAudience = fallback(product.targetAudience, "주요 고객");
  const primaryUsp = firstFilledLine(product.usp, "매일 쓰기 좋은 실용성");
  const primarySpec = firstFilledLine(product.specs, "기본 구성 정보");
  const tone = toneGuide[product.tone];

  switch (section.kind) {
    case "hero":
      return `${brandName} ${productName}\n\n${targetAudience}을 위해 ${primaryUsp}을 먼저 보여주는 더미 히어로 카피입니다. ${tone}으로 첫 화면에서 상품의 쓰임과 기대감을 빠르게 전달합니다.`;
    case "usp":
      return `${productName}의 더미 USP\n${bulletLines(product.usp, [
        "고객이 바로 이해할 수 있는 핵심 장점",
        "상세페이지 상단에서 반복하기 좋은 메시지",
        "구매 전 확인해야 할 차별점",
      ])}`;
    case "spec":
      return `${category} 구매 전 확인 정보\n${bulletLines(product.specs, [
        primarySpec,
        "옵션과 구성은 실제 판매 정보에 맞춰 교체",
        "배송/사용 조건은 최종 검수 단계에서 확인",
      ])}`;
    case "comparison":
      return `기존 선택지가 애매했던 ${targetAudience}에게 ${productName}은 ${primaryUsp}을 기준으로 비교 포인트를 잡아줍니다.\n\n불필요한 과장 대신 사용 상황, 관리 방식, 선택 기준을 나눠 보여주는 더미 문제 해결 섹션입니다.`;
    case "faq":
      return `Q. ${productName}은 어떤 고객에게 맞나요?\nA. ${targetAudience}에게 맞춰 소개하는 더미 답변입니다.\n\nQ. 구매 전 무엇을 확인해야 하나요?\nA. ${primarySpec}을 먼저 확인하고, 옵션과 구성은 실제 판매 조건에 맞게 조정합니다.`;
    case "cta":
      return `${brandName} ${productName} 구매 안내\n\n${category} 상품 특성에 맞춰 옵션, 구성, 사용 목적을 확인한 뒤 선택하도록 안내합니다. 금지 표현은 제외하고 ${tone}으로 마무리하는 더미 CTA입니다.`;
  }
}
