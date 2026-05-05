"use client";

import { useMemo, useState } from "react";
import { DetailPreview } from "@/src/components/detail-preview";
import { ProductInputForm } from "@/src/components/product-input-form";
import { SectionListPanel } from "@/src/components/section-list-panel";
import type { DetailSection, ProductInfo } from "@/src/types";

const initialProduct: ProductInfo = {
  projectName: "신제품 상세페이지 초안",
  clientName: "개인 외주 클라이언트",
  brandName: "온하루",
  productName: "웜핏 발열 패딩 베스트",
  category: "겨울 의류 / 생활 방한용품",
  targetAudience: "출퇴근과 야외 활동이 잦고 가볍지만 따뜻한 방한 아이템을 찾는 30~50대 고객",
  tone: "clear",
  usp: "가벼운 착용감, 분리형 발열 패드, 생활 방수 원단, 쉬운 세탁 관리",
  specs: "겉감: 폴리에스터 100%\n충전재: 경량 패딩\n사이즈: S, M, L, XL\n색상: 블랙, 차콜",
  forbiddenPhrases: "최고, 1위, 완치, 무조건, 과장된 효능 표현",
  notes: "의료기기가 아니며 체온 유지 보조 목적의 제품으로 표현한다.",
};

function makeSections(product: ProductInfo): DetailSection[] {
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

export function DetailWorkspace() {
  const [product, setProduct] = useState<ProductInfo>(initialProduct);
  const sections = useMemo(() => makeSections(product), [product]);

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-1">
          <p className="text-xs font-medium text-zinc-500">개인 외주용 MVP</p>
          <h1 className="text-xl font-semibold tracking-tight">상세페이지 제작기</h1>
          <p className="text-sm text-zinc-500">
            현재 단계는 API 호출 없이 입력값과 더미 카피만으로 섹션 미리보기를 조립합니다.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-5 lg:grid-cols-[420px_minmax(0,1fr)]">
        <aside className="min-w-0">
          <ProductInputForm value={product} onChange={setProduct} />
        </aside>

        <section className="grid min-w-0 gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <SectionListPanel sections={sections} />
          <DetailPreview product={product} sections={sections} />
        </section>
      </div>
    </main>
  );
}
