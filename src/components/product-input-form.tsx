"use client";

import type { ProductContextForm } from "@/src/types/detail-page";

const fieldCls =
  "rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 placeholder:text-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500";

type Props = {
  value: ProductContextForm;
  onChange: (next: ProductContextForm) => void;
};

export function ProductInputForm({ value, onChange }: Props) {
  const patch = (partial: Partial<ProductContextForm>) =>
    onChange({ ...value, ...partial });

  return (
    <div className="flex flex-col gap-5">
      <header className="space-y-1">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          상품·클라이언트 입력
        </h2>
        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          스펙·USP·타깃·톤을 모으는 단계입니다. 변경 사항은 아래 미리보기에
          즉시 반영됩니다.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            프로젝트명
          </span>
          <input
            className={fieldCls}
            value={value.projectName}
            onChange={(e) => patch({ projectName: e.target.value })}
            placeholder="예: 2026 SS 상세 페이지"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            클라이언트
          </span>
          <input
            className={fieldCls}
            value={value.clientName}
            onChange={(e) => patch({ clientName: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            브랜드명
          </span>
          <input
            className={fieldCls}
            value={value.brandName}
            onChange={(e) => patch({ brandName: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            상품명
          </span>
          <input
            className={fieldCls}
            value={value.productName}
            onChange={(e) => patch({ productName: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            카테고리 / 품목
          </span>
          <input
            className={fieldCls}
            value={value.category}
            onChange={(e) => patch({ category: e.target.value })}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          타깃·페르소나
        </span>
        <textarea
          className={`${fieldCls} min-h-[88px] resize-y`}
          value={value.targetAudience}
          onChange={(e) => patch({ targetAudience: e.target.value })}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          톤
        </span>
        <select
          className={fieldCls}
          value={value.tone}
          onChange={(e) =>
            patch({
              tone: e.target.value as ProductContextForm["tone"],
            })
          }
        >
          <option value="professional">전문·신뢰</option>
          <option value="friendly">친근·대화형</option>
          <option value="luxury">럭셔리·격식</option>
          <option value="minimal">미니멀·건조</option>
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          금지·주의 표현
        </span>
        <textarea
          className={`${fieldCls} min-h-[72px] resize-y`}
          value={value.forbiddenPhrases}
          onChange={(e) => patch({ forbiddenPhrases: e.target.value })}
          placeholder="과장 금지, 비교 허위·의료 효능 등"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          USP / 차별 포인트
        </span>
        <textarea
          className={`${fieldCls} min-h-[100px] resize-y`}
          value={value.usp}
          onChange={(e) => patch({ usp: e.target.value })}
          placeholder="한 줄당 하나씩, 또는 줄바꿈으로 구분해 적어두면 미리보기 요약에 반영하기 좋습니다."
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          스펙·원재료 등
        </span>
        <textarea
          className={`${fieldCls} min-h-[100px] resize-y`}
          value={value.specs}
          onChange={(e) => patch({ specs: e.target.value })}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          법적·인증 메모 (내부 참고 텍스트)
        </span>
        <textarea
          className={`${fieldCls} min-h-[80px] resize-y`}
          value={value.legalNotes}
          onChange={(e) => patch({ legalNotes: e.target.value })}
        />
      </label>
    </div>
  );
}
