import { generateDummySectionCopy } from "@/src/lib/dummy-generator";
import type {
  DetailSection,
  GeneratedSectionCopy,
  GenerateSectionInput,
  SectionKind,
} from "@/src/types";

function createSectionShell(sectionKind: SectionKind): DetailSection {
  return {
    id: sectionKind,
    kind: sectionKind,
    title: sectionKind,
    description: "",
    copy: "",
  };
}

export async function generateSection({
  sectionKind,
  product,
  tone,
  generationMode,
}: GenerateSectionInput): Promise<GeneratedSectionCopy> {
  const generatedAt = new Date().toISOString();
  const section = createSectionShell(sectionKind);
  const content = generateDummySectionCopy(
    {
      ...product,
      tone,
    },
    section,
    {
      generationSeed: `${generationMode}:${sectionKind}:${generatedAt}`,
    },
  );

  return {
    content,
    sectionKind,
    source: "dummy",
    generatedAt,
  };
}
