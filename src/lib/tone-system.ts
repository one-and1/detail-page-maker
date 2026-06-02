import {
  getTonePromptRule,
  TONE_DESCRIPTIONS,
  type TonePromptSectionKind,
} from "@/src/prompts/tone-rules";
import { SUPPORTED_TONES, type Tone } from "@/src/types";

export const TONE_LABELS: Record<Tone, string> = {
  premium: "Premium",
  emotional: "Emotional",
  clean: "Clean",
  professional: "Professional",
};

export { TONE_DESCRIPTIONS };

export function isSupportedTone(value: unknown): value is Tone {
  return typeof value === "string" && SUPPORTED_TONES.includes(value as Tone);
}

export function normalizeTone(value: unknown): Tone {
  if (isSupportedTone(value)) {
    return value;
  }

  if (value === "friendly") {
    return "emotional";
  }

  if (value === "clear" || value === "minimal") {
    return "clean";
  }

  return "clean";
}

export function getToneInstruction(
  tone: Tone,
  sectionKind: TonePromptSectionKind = "hero",
) {
  return getTonePromptRule(tone, sectionKind);
}
