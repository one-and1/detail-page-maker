"use client";

import type { ProductInfo } from "@/src/types";

type Props = {
  value: ProductInfo;
  onChange: (next: ProductInfo) => void;
};

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200";

const labelClass = "text-xs font-medium text-zinc-600";

export function ProductInputForm({ value, onChange }: Props) {
  const patch = (partial: Partial<ProductInfo>) => {
    onChange({ ...value, ...partial });
  };

  return (
    <form
      className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold">상품 정보 입력</h2>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          섹션 생성에 필요한 최소 정보만 모으는 MVP 폼입니다.
        </p>
      </div>

      <div className="grid gap-4">
        <Field label="프로젝트명">
          <input
            className={inputClass}
            value={value.projectName}
            onChange={(event) => patch({ projectName: event.target.value })}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Field label="클라이언트명">
            <input
              className={inputClass}
              value={value.clientName}
              onChange={(event) => patch({ clientName: event.target.value })}
            />
          </Field>
          <Field label="브랜드명">
            <input
              className={inputClass}
              value={value.brandName}
              onChange={(event) => patch({ brandName: event.target.value })}
            />
          </Field>
        </div>

        <Field label="상품명">
          <input
            className={inputClass}
            value={value.productName}
            onChange={(event) => patch({ productName: event.target.value })}
          />
        </Field>

        <Field label="카테고리">
          <input
            className={inputClass}
            value={value.category}
            onChange={(event) => patch({ category: event.target.value })}
          />
        </Field>

        <Field label="타깃 고객">
          <textarea
            className={`${inputClass} min-h-20 resize-y`}
            value={value.targetAudience}
            onChange={(event) => patch({ targetAudience: event.target.value })}
          />
        </Field>

        <Field label="톤">
          <select
            className={inputClass}
            value={value.tone}
            onChange={(event) =>
              patch({ tone: event.target.value as ProductInfo["tone"] })
            }
          >
            <option value="clear">명확하고 실용적</option>
            <option value="friendly">친근한 설명형</option>
            <option value="premium">프리미엄</option>
            <option value="minimal">미니멀</option>
          </select>
        </Field>

        <Field label="USP / 차별점">
          <textarea
            className={`${inputClass} min-h-24 resize-y`}
            value={value.usp}
            onChange={(event) => patch({ usp: event.target.value })}
          />
        </Field>

        <Field label="스펙">
          <textarea
            className={`${inputClass} min-h-24 resize-y`}
            value={value.specs}
            onChange={(event) => patch({ specs: event.target.value })}
          />
        </Field>

        <Field label="금지 표현">
          <textarea
            className={`${inputClass} min-h-16 resize-y`}
            value={value.forbiddenPhrases}
            onChange={(event) => patch({ forbiddenPhrases: event.target.value })}
          />
        </Field>

        <Field label="메모">
          <textarea
            className={`${inputClass} min-h-20 resize-y`}
            value={value.notes}
            onChange={(event) => patch({ notes: event.target.value })}
          />
        </Field>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}
