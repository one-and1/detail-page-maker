import { generateSection } from "@/src/lib/ai/generate-section";
import type {
  GenerationMode,
  GenerateSectionInput,
  ProductInfo,
  SectionKind,
  Tone,
} from "@/src/types";

const SECTION_KINDS = ["hero", "usp", "spec", "comparison", "faq", "cta"] as const;
const TONES = ["clear", "friendly", "premium", "minimal"] as const;
const GENERATION_MODES = ["dummy", "live", "disabled"] as const;

type ValidationResult =
  | { ok: true; data: GenerateSectionInput }
  | { ok: false; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isSectionKind(value: unknown): value is SectionKind {
  return isString(value) && SECTION_KINDS.includes(value as SectionKind);
}

function isTone(value: unknown): value is Tone {
  return isString(value) && TONES.includes(value as Tone);
}

function isGenerationMode(value: unknown): value is GenerationMode {
  return isString(value) && GENERATION_MODES.includes(value as GenerationMode);
}

function validateProduct(value: unknown): ProductInfo | null {
  if (!isRecord(value)) {
    return null;
  }

  const productFields = [
    "projectName",
    "clientName",
    "brandName",
    "productName",
    "category",
    "targetAudience",
    "usp",
    "specs",
    "forbiddenPhrases",
    "notes",
  ] as const;

  for (const field of productFields) {
    if (!isString(value[field])) {
      return null;
    }
  }

  if (!isTone(value.tone)) {
    return null;
  }

  return {
    projectName: value.projectName as string,
    clientName: value.clientName as string,
    brandName: value.brandName as string,
    productName: value.productName as string,
    category: value.category as string,
    targetAudience: value.targetAudience as string,
    tone: value.tone,
    usp: value.usp as string,
    specs: value.specs as string,
    forbiddenPhrases: value.forbiddenPhrases as string,
    notes: value.notes as string,
  };
}

function validateGenerateSectionRequest(body: unknown): ValidationResult {
  if (!isRecord(body)) {
    return { ok: false, message: "Request body must be a JSON object." };
  }

  if (!isSectionKind(body.sectionKind)) {
    return { ok: false, message: "sectionKind is invalid." };
  }

  const product = validateProduct(body.product);

  if (!product) {
    return { ok: false, message: "product is invalid." };
  }

  if (!isTone(body.tone)) {
    return { ok: false, message: "tone is invalid." };
  }

  if (!isGenerationMode(body.generationMode)) {
    return { ok: false, message: "generationMode is invalid." };
  }

  return {
    ok: true,
    data: {
      sectionKind: body.sectionKind,
      product: {
        ...product,
        tone: body.tone,
      },
      tone: body.tone,
      generationMode: body.generationMode,
    },
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const validation = validateGenerateSectionRequest(body);

  if (!validation.ok) {
    return Response.json({ error: validation.message }, { status: 400 });
  }

  const generatedSection = await generateSection(validation.data);

  return Response.json({
    ...generatedSection,
    cached: false,
  });
}
