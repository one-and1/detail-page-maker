import type { DetailSection, ProductInfo } from "@/src/types";

export function makeSections(product: ProductInfo): DetailSection[] {
  const productName = product.productName || "상품명";
  const brandName = product.brandName || "브랜드";
  const usp = product.usp || "핵심 장점을 입력하면 이 영역의 더미 카피에 반영됩니다.";
  const specs = product.specs || "스펙 정보를 입력하면 구매 전 확인 영역에 반영됩니다.";

  return [
    {
      id: "hero",
      kind: "hero",
      title: "히어로",
      description: "첫 화면에서 상품의 핵심 인상을 잡는 섹션",
      copy: `${brandName} ${productName}\n\n매일 입는 방한 아이템을 더 가볍고 단정하게. 필요한 기능만 정리해 고객이 첫 화면에서 상품의 용도를 바로 이해하도록 구성합니다.`,
    },
    {
      id: "usp",
      kind: "usp",
      title: "핵심 USP",
      description: "고객이 기억해야 할 차별점 요약",
      copy: `이 상품의 핵심 포인트\n${usp
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => `- ${item}`)
        .join("\n")}`,
    },
    {
      id: "spec",
      kind: "spec",
      title: "스펙 안내",
      description: "소재, 구성, 사이즈 등 구매 판단 정보",
      copy: `구매 전 확인하세요\n${specs}`,
    },
    {
      id: "comparison",
      kind: "comparison",
      title: "비교/문제 해결",
      description: "기존 불편과 이 상품의 해결 방식을 연결",
      copy: `두꺼운 외투가 부담스러운 날에도 ${productName}은 필요한 보온감과 활동성을 함께 고려합니다. 고객이 느끼는 불편을 먼저 짚고, 상품의 기능을 해결책으로 보여주는 구성입니다.`,
    },
    {
      id: "faq",
      kind: "faq",
      title: "FAQ",
      description: "반품, 세탁, 사용법 등 반복 문의 대응",
      copy: `Q. 세탁은 어떻게 하나요?\nA. 구성품을 분리한 뒤 케어라벨 기준에 맞춰 관리하도록 안내합니다.\n\nQ. 어떤 고객에게 적합한가요?\nA. ${product.targetAudience || "주요 타깃 고객"}에게 맞춘 사용 상황을 제안합니다.`,
    },
    {
      id: "cta",
      kind: "cta",
      title: "구매 안내",
      description: "옵션 선택과 구매 전 확인 사항 정리",
      copy: `${product.category || "카테고리"} 상품입니다. 사이즈, 색상, 구성품을 확인한 뒤 구매하도록 안내하고, 금지 표현은 사용하지 않는 방향으로 마무리합니다.`,
    },
  ];
}
