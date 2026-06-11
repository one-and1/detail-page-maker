import type { DetailSection } from "@/src/types";
import { Card } from "@/src/components/ui/card";
import { Text } from "@/src/components/ui/typography";

type Props = {
  sections: DetailSection[];
};

export function SectionListPanel({ sections }: Props) {
  return (
    <Card>
      <div className="mb-4">
        <Text as="h2" variant="title">
          상세페이지 섹션
        </Text>
        <Text className="mt-1" variant="caption">
          MVP에서는 섹션별 더미 카피를 로컬에서만 보여줍니다.
        </Text>
      </div>

      <ol className="grid gap-3">
        {sections.map((section, index) => (
          <li
            key={section.id}
            className="rounded-md border border-slate-200 bg-slate-50 p-3"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <div className="min-w-0">
                <Text as="h3" className="text-sm" variant="title">
                  {section.title}
                </Text>
                <Text className="mt-1" variant="caption">
                  {section.description}
                </Text>
                <Text className="mt-2 line-clamp-2 text-slate-700" variant="caption">
                  {section.copy}
                </Text>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
