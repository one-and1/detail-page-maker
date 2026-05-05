"use client";

import { useMemo, useState } from "react";
import { DetailPreview } from "@/src/components/detail-preview";
import { ProductInputForm } from "@/src/components/product-input-form";
import { SectionListPanel } from "@/src/components/section-list-panel";
import { makeSections } from "@/src/lib/make-sections";
import type { ProductInfo } from "@/src/types";

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
