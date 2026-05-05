import type { DetailSection, ProductInfo } from "@/src/types";

type Props = {
  product: ProductInfo;
  sections: DetailSection[];
};

const toneLabel: Record<ProductInfo["tone"], string> = {
  clear: "명확하고 실용적",
  friendly: "친근한 설명형",
  premium: "프리미엄",
  minimal: "미니멀",
};

export function DetailPreview({ product, sections }: Props) {
  return (
    <article className="min-w-0 rounded-lg border border-zinc-200 bg-white shadow-sm">
      <header className="border-b border-zinc-200 px-5 py-4">
        <p className="text-xs font-medium text-zinc-500">섹션 미리보기</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight">
          {product.brandName} {product.productName}
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          {product.projectName} · {toneLabel[product.tone]}
        </p>
      </header>

      <div className="mx-auto max-w-2xl px-5 py-8">
        {sections.map((section, index) => (
          <section
            key={section.id}
            className={index === 0 ? "" : "mt-10 border-t border-zinc-100 pt-10"}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              {section.kind}
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">
              {section.title}
            </h3>
            <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-700">
              {section.copy}
            </div>
          </section>
        ))}

        <footer className="mt-10 border-t border-zinc-100 pt-6 text-xs leading-6 text-zinc-500">
          <p>금지 표현: {product.forbiddenPhrases || "입력 없음"}</p>
          <p>내부 메모: {product.notes || "입력 없음"}</p>
        </footer>
      </div>
    </article>
  );
}
