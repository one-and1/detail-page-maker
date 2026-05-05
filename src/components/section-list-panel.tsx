import type { DetailSection } from "@/src/types";

type Props = {
  sections: DetailSection[];
};

export function SectionListPanel({ sections }: Props) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold">상세페이지 섹션</h2>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          MVP에서는 섹션별 더미 카피를 로컬에서만 보여줍니다.
        </p>
      </div>

      <ol className="grid gap-3">
        {sections.map((section, index) => (
          <li
            key={section.id}
            className="rounded-md border border-zinc-200 bg-zinc-50 p-3"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-zinc-950">
                  {section.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  {section.description}
                </p>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-700">
                  {section.copy}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
