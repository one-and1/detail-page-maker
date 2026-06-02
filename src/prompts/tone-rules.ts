import type { SectionKind, Tone } from "@/src/types";

export type TonePromptSectionKind = Extract<
  SectionKind,
  "hero" | "usp" | "cta" | "faq"
>;

type ToneRule = {
  description: string;
  strategy: string;
  sentenceLength: string;
  sentenceStructure: string;
  emotionLevel: string;
  informationDensity: string;
  copyRhythm: string;
  example: string;
};

const toneRules: Record<Tone, ToneRule> = {
  premium: {
    description: "절제된 고급감과 완성도 중심의 표현",
    strategy:
      "Lead with lasting value, finish, fit, and selection confidence. Do not lean on emotion, urgency, or luxury cliches.",
    sentenceLength:
      "Use short to medium-short sentences. Keep them compact, but avoid sounding casual or clipped.",
    sentenceStructure:
      "Prefer composed declarative lines, noun phrases, and a restrained final sentence that leaves space.",
    emotionLevel:
      "Low emotion. Use calm confidence instead of excitement, surprise, or sympathy.",
    informationDensity:
      "Medium-low. Mention only the one value or quality that supports a refined choice.",
    copyRhythm:
      "Quiet, spacious, and deliberate. Avoid stacked adjectives, exclamation marks, and hard-selling.",
    example: "오래 사용할수록 차이가 느껴지는 선택.",
  },
  emotional: {
    description: "일상 상황과 감정 변화 중심의 자연스러운 표현",
    strategy:
      "Start from the user's day, inconvenience, small expectation, or moment after use. Make the benefit feel lived-in.",
    sentenceLength:
      "Use medium sentences that sound spoken and natural. Short fragments are allowed for warmth.",
    sentenceStructure:
      "Prefer scene-first lines, cause-and-feeling flow, and conversational phrasing.",
    emotionLevel:
      "Medium-high emotion. Show relief, anticipation, comfort, or small delight without melodrama.",
    informationDensity:
      "Low to medium. Translate features into daily feelings instead of listing specs.",
    copyRhythm:
      "Warm, flowing, and familiar. Let the copy read like a buyer's real moment.",
    example: "퇴근하고 집에 와서 가장 먼저 찾게 되는 이유.",
  },
  clean: {
    description: "가장 짧고 간결한 미니멀 표현",
    strategy:
      "Remove decoration and say only the core use, benefit, or next step. Prefer clarity over persuasion.",
    sentenceLength:
      "Use the shortest sentences among all tones. Keep each line minimal.",
    sentenceStructure:
      "Prefer direct noun phrases, simple verb phrases, and single-benefit statements.",
    emotionLevel:
      "Very low emotion. Remove unnecessary feeling words and most adjectives.",
    informationDensity:
      "Low. Include only essential information needed to understand the section.",
    copyRhythm:
      "Minimal, sharp, and easy to scan. No buildup, no ornamental rhythm.",
    example: "필요한 것만 남긴 사용감.",
  },
  professional: {
    description: "기능, 근거, 신뢰를 중심으로 한 실용적 표현",
    strategy:
      "Frame the copy around purpose, criteria, fit, usage conditions, and practical decision value.",
    sentenceLength:
      "Use medium-short sentences with enough detail to be useful. Avoid long textbook explanations.",
    sentenceStructure:
      "Prefer criteria-first, benefit-after, and condition-based sentences.",
    emotionLevel:
      "Low emotion. Use trust, clarity, and usefulness instead of sentiment.",
    informationDensity:
      "Medium-high. Include relevant functional context, limits, checks, or selection criteria.",
    copyRhythm:
      "Orderly, grounded, and efficient. It should feel advisory, not stiff.",
    example: "사용 목적에 맞춰 설계된 실용적 구성.",
  },
};

const sectionToneFocus: Record<TonePromptSectionKind, Record<Tone, string>> = {
  hero: {
    premium:
      "Open like a selective editorial line: one durable value, one composed reason to look closer.",
    emotional:
      "Open from a felt daily moment, inconvenience, or expectation before naming the benefit.",
    clean:
      "State the core use and benefit immediately with the fewest possible words.",
    professional:
      "Frame the product through a clear purchase criterion or usage purpose.",
  },
  usp: {
    premium:
      "Make each USP feel curated around finish, durability, materiality, or long-term satisfaction.",
    emotional:
      "Turn each strength into a small daily relief, comfort, or change the user can picture.",
    clean:
      "Make each bullet a compact single-benefit line. Remove setup and emotional buildup.",
    professional:
      "Write each bullet as a selection criterion with a grounded practical benefit.",
  },
  cta: {
    premium:
      "Close with calm assurance. Suggest consideration, not urgency or pressure.",
    emotional:
      "Close with the user's next moment after purchase and a warm low-pressure action.",
    clean:
      "Close with one simple decision line and one minimal action phrase.",
    professional:
      "Close by guiding the reader to verify fit, options, or usage conditions.",
  },
  faq: {
    premium:
      "Answer briefly with polished reassurance and restrained wording.",
    emotional:
      "Reduce concern with situation-aware answers that feel friendly and human.",
    clean:
      "Answer in plain, short lines. Remove extra courtesy, slogans, and buildup.",
    professional:
      "Answer with conditions, limits, checks, and decision criteria when relevant.",
  },
};

export const TONE_DESCRIPTIONS: Record<Tone, string> = {
  premium: toneRules.premium.description,
  emotional: toneRules.emotional.description,
  clean: toneRules.clean.description,
  professional: toneRules.professional.description,
};

export function getToneRule(tone: Tone) {
  return toneRules[tone];
}

export function getTonePromptRule(
  tone: Tone,
  sectionKind: TonePromptSectionKind,
) {
  const rule = toneRules[tone];

  return [
    `${tone.toUpperCase()} tone strategy:`,
    `- Core strategy: ${rule.strategy}`,
    `- Sentence length: ${rule.sentenceLength}`,
    `- Sentence structure: ${rule.sentenceStructure}`,
    `- Emotion strength: ${rule.emotionLevel}`,
    `- Information amount: ${rule.informationDensity}`,
    `- Copy rhythm: ${rule.copyRhythm}`,
    `- Section focus: ${sectionToneFocus[sectionKind][tone]}`,
    `- Reference example for rhythm only, do not copy: "${rule.example}"`,
  ].join("\n");
}
