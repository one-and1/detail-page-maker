"use client";

import type { ProductInfo } from "@/src/types";
import { SUPPORTED_TONES } from "@/src/types";
import { TONE_DESCRIPTIONS, TONE_LABELS } from "@/src/lib/tone-system";
import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/typography";
import { cn } from "@/src/lib/class-names";
import { designTokens, fieldControlClass } from "@/src/lib/design-system";

type Props = {
  value: ProductInfo;
  onChange: (next: ProductInfo) => void;
};

export function ProductInputForm({ value, onChange }: Props) {
  const patch = (partial: Partial<ProductInfo>) => {
    onChange({ ...value, ...partial });
  };

  return (
    <Card as="form" onSubmit={(event) => event.preventDefault()}>
      <div className="mb-4">
        <Text as="h2" variant="title">
          상품 정보 입력
        </Text>
        <Text className="mt-1" variant="caption">
          섹션 생성에 필요한 최소 정보만 모으는 MVP 폼입니다.
        </Text>
      </div>

      <div className="grid gap-4">
        <Field label="프로젝트명">
          <input
            className={fieldControlClass}
            value={value.projectName}
            onChange={(event) => patch({ projectName: event.target.value })}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Field label="클라이언트명">
            <input
              className={fieldControlClass}
              value={value.clientName}
              onChange={(event) => patch({ clientName: event.target.value })}
            />
          </Field>
          <Field label="브랜드명">
            <input
              className={fieldControlClass}
              value={value.brandName}
              onChange={(event) => patch({ brandName: event.target.value })}
            />
          </Field>
        </div>

        <Field label="상품명">
          <input
            className={fieldControlClass}
            value={value.productName}
            onChange={(event) => patch({ productName: event.target.value })}
          />
        </Field>

        <Field label="카테고리">
          <input
            className={fieldControlClass}
            value={value.category}
            onChange={(event) => patch({ category: event.target.value })}
          />
        </Field>

        <Field label="타깃 고객">
          <textarea
            className={cn(fieldControlClass, "min-h-20 resize-y")}
            value={value.targetAudience}
            onChange={(event) => patch({ targetAudience: event.target.value })}
          />
        </Field>

        <Field label="톤">
          <select
            className={fieldControlClass}
            value={value.tone}
            onChange={(event) =>
              patch({ tone: event.target.value as ProductInfo["tone"] })
            }
          >
            {SUPPORTED_TONES.map((tone) => (
              <option key={tone} value={tone}>
                {TONE_LABELS[tone]} - {TONE_DESCRIPTIONS[tone]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="USP / 차별점">
          <textarea
            className={cn(fieldControlClass, "min-h-24 resize-y")}
            value={value.usp}
            onChange={(event) => patch({ usp: event.target.value })}
          />
        </Field>

        <Field label="스펙">
          <textarea
            className={cn(fieldControlClass, "min-h-24 resize-y")}
            value={value.specs}
            onChange={(event) => patch({ specs: event.target.value })}
          />
        </Field>

        <Field label="금지 표현">
          <textarea
            className={cn(fieldControlClass, "min-h-16 resize-y")}
            value={value.forbiddenPhrases}
            onChange={(event) => patch({ forbiddenPhrases: event.target.value })}
          />
        </Field>

        <Field label="메모">
          <textarea
            className={cn(fieldControlClass, "min-h-20 resize-y")}
            value={value.notes}
            onChange={(event) => patch({ notes: event.target.value })}
          />
        </Field>
      </div>
    </Card>
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
      <span className={designTokens.text.label}>{label}</span>
      {children}
    </label>
  );
}
