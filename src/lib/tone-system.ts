import { SUPPORTED_TONES, type SectionKind, type Tone } from "@/src/types";

export const TONE_LABELS: Record<Tone, string> = {
  premium: "Premium",
  emotional: "Emotional",
  clean: "Clean",
  professional: "Professional",
};

export const TONE_DESCRIPTIONS: Record<Tone, string> = {
  premium: "정제된 고급감, 낮은 압박감, 여백 있는 표현",
  emotional: "사용자의 감정과 일상 장면을 먼저 건드리는 표현",
  clean: "짧고 명확한 정보 중심 표현",
  professional: "전문가처럼 기준과 근거를 정리하는 신뢰형 표현",
};

const toneInstructions: Record<Tone, string> = {
  premium:
    "Use refined, restrained Korean copy. Prefer curated sensory words, calm confidence, and spacious rhythm. Avoid loud urgency, exclamation marks, cheap luxury cliches, and hard-sell commands.",
  emotional:
    "Use empathetic Korean copy grounded in the user's daily feelings and situations. Prefer warm scene-setting, soft rhythm, and relatable worries. Avoid over-explaining features or using customer honorifics.",
  clean:
    "Use clean Korean copy that is short, concrete, and easy to scan. Lead with the practical benefit, remove decoration, and keep wording plain. Avoid emotional buildup, ornate adjectives, and vague slogans.",
  professional:
    "Use professional Korean copy with measured confidence. Explain criteria, fit, usage conditions, and practical checks like an expert advisor. Avoid hype, pressure, and casual chatter.",
};

const sectionToneHints: Record<Extract<SectionKind, "hero" | "usp" | "cta" | "faq">, Record<Tone, string>> = {
  hero: {
    premium: "Hero should feel like an editorial opening: elegant, quiet, and selective.",
    emotional: "Hero should open with a felt daily moment or buyer anxiety.",
    clean: "Hero should state the core use and benefit immediately.",
    professional: "Hero should frame the product through a clear purchase criterion.",
  },
  usp: {
    premium: "USP bullets should sound curated and composed, not feature-heavy.",
    emotional: "USP bullets should translate strengths into small felt changes.",
    clean: "USP bullets should be compact, direct, and scannable.",
    professional: "USP bullets should read like selection criteria with grounded benefits.",
  },
  cta: {
    premium: "CTA should close with calm assurance and no pressure.",
    emotional: "CTA should leave a warm image of use after purchase.",
    clean: "CTA should give a simple next step with minimal words.",
    professional: "CTA should guide the reader to verify fit, options, and conditions.",
  },
  faq: {
    premium: "FAQ answers should be polished, reassuring, and brief.",
    emotional: "FAQ answers should reduce concern with friendly, situation-aware wording.",
    clean: "FAQ answers should be plain, short, and practical.",
    professional: "FAQ answers should emphasize limits, conditions, and decision criteria.",
  },
};

export function isSupportedTone(value: unknown): value is Tone {
  return (
    typeof value === "string" &&
    SUPPORTED_TONES.includes(value as Tone)
  );
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
  sectionKind?: Extract<SectionKind, "hero" | "usp" | "cta" | "faq">,
) {
  const sectionHint = sectionKind ? sectionToneHints[sectionKind][tone] : "";

  return [toneInstructions[tone], sectionHint].filter(Boolean).join(" ");
}
