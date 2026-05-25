import OpenAI from "openai";
import { generateDummySectionCopy } from "@/src/lib/dummy-generator";
import { getServerAiEnv } from "@/src/lib/env";
import type {
  DetailSection,
  GeneratedSectionCopy,
  GenerateSectionInput,
  GenerationMode,
  SectionKind,
} from "@/src/types";

const OPENAI_TIMEOUT_MS = 12_000;
const OPENAI_MAX_COMPLETION_TOKENS = 280;

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

function createFallbackOpenAiResponse({
  sectionKind,
  product,
  tone,
  generatedAt,
}: Pick<GenerateSectionInput, "product" | "sectionKind" | "tone"> & {
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
      generationSeed: `openai-fallback:${sectionKind}:${generatedAt}`,
    },
  );

  return {
    content,
    sectionKind,
    source: "openai",
    generatedAt,
  };
}

function getSectionInstruction(sectionKind: SectionKind) {
  switch (sectionKind) {
    case "hero":
      return "Create a concise hero section: one strong headline and one short supporting sentence.";
    case "usp":
      return "Create a USP section: 3 short benefit bullets focused on concrete product strengths.";
    case "faq":
      return "Create an FAQ section: 3 brief Q&A pairs that address practical buyer concerns.";
    case "cta":
      return "Create a CTA section: one short closing line and one direct action phrase.";
    case "spec":
      return "Create a specs section: summarize only the provided product specs in readable lines.";
    case "comparison":
      return "Create a comparison section: contrast the product with common alternatives using modest claims.";
  }
}

function buildOpenAiPrompt({ product, sectionKind, tone }: GenerateSectionInput) {
  return [
    getSectionInstruction(sectionKind),
    "",
    "Rules:",
    "- Write in Korean.",
    "- Generate only this single section. Do not create a full detail page.",
    "- Keep the output plain text, short, and ready to paste into the existing section copy field.",
    "- Do not invent certifications, rankings, prices, discounts, or guaranteed effects.",
    "- Avoid forbidden phrases exactly as provided.",
    "",
    "Product context:",
    `- Brand: ${product.brandName}`,
    `- Product: ${product.productName}`,
    `- Category: ${product.category}`,
    `- Target audience: ${product.targetAudience}`,
    `- Tone: ${tone}`,
    `- USP: ${product.usp}`,
    `- Specs: ${product.specs}`,
    `- Forbidden phrases: ${product.forbiddenPhrases}`,
    `- Notes: ${product.notes}`,
  ].join("\n");
}

async function generateOpenAiSection(
  input: GenerateSectionInput,
  generatedAt: string,
): Promise<GeneratedSectionCopy> {
  const env = getServerAiEnv();

  if (!env.openaiApiKey || !env.openaiModel) {
    return createFallbackOpenAiResponse({ ...input, generatedAt });
  }

  try {
    const openai = new OpenAI({
      apiKey: env.openaiApiKey,
      maxRetries: 0,
      timeout: OPENAI_TIMEOUT_MS,
    });
    const response = await openai.chat.completions.create(
      {
        model: env.openaiModel,
        temperature: 0.4,
        max_completion_tokens: OPENAI_MAX_COMPLETION_TOKENS,
        messages: [
          {
            role: "system",
            content:
              "You write cost-conscious ecommerce detail-page copy. Use only the provided slot fields and answer with a single section.",
          },
          {
            role: "user",
            content: buildOpenAiPrompt(input),
          },
        ],
      },
      {
        timeout: OPENAI_TIMEOUT_MS,
      },
    );
    const content = response.choices[0]?.message.content?.trim();

    if (!content) {
      return createFallbackOpenAiResponse({ ...input, generatedAt });
    }

    return {
      content,
      sectionKind: input.sectionKind,
      source: "openai",
      generatedAt,
    };
  } catch {
    return createFallbackOpenAiResponse({ ...input, generatedAt });
  }
}

export async function generateSection(input: GenerateSectionInput): Promise<GeneratedSectionCopy> {
  const generatedAt = new Date().toISOString();
  const mode = input.generationMode ?? getServerAiEnv().generationMode;

  if (mode === "openai") {
    return generateOpenAiSection(input, generatedAt);
  }

  return generateDummySection({
    ...input,
    generationMode: mode,
    generatedAt,
  });
}
