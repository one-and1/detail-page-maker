import { generateDummySectionCopy } from "@/src/lib/dummy-generator";
import { getServerAiEnv } from "@/src/lib/env";
import type {
  DetailSection,
  GeneratedSectionCopy,
  GenerateSectionInput,
  GenerationMode,
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

function generateDummySection({
  sectionKind,
  product,
  tone,
  generationMode,
  generatedAt,
}: GenerateSectionInput & {
  generationMode: GenerationMode;
  generatedAt: string;
}): GeneratedSectionCopy {
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

function createOpenAiNotImplementedResponse({
  sectionKind,
  generatedAt,
}: Pick<GenerateSectionInput, "sectionKind"> & {
  generatedAt: string;
}): GeneratedSectionCopy {
  return {
    content: "OpenAI mode is not implemented yet.",
    sectionKind,
    source: "openai",
    generatedAt,
  };
}

export async function generateSection(input: GenerateSectionInput): Promise<GeneratedSectionCopy> {
  const generatedAt = new Date().toISOString();
  const mode = input.generationMode ?? getServerAiEnv().generationMode;

  if (mode === "openai") {
    return createOpenAiNotImplementedResponse({
      sectionKind: input.sectionKind,
      generatedAt,
    });
  }

  return generateDummySection({
    ...input,
    generationMode: mode,
    generatedAt,
  });
}
