import type { ProductInfo, Tone } from "@/src/types";
import { getCommonCopyRules } from "@/src/prompts/copy-rules";
import { getTonePromptRule } from "@/src/prompts/tone-rules";

export function buildCtaPrompt(product: ProductInfo, tone: Tone): string {
  return [
    "Create a Korean CTA section for the final section of an ecommerce detail page.",
    "Output exactly 2 lines:",
    "1. Closing line: one short, memorable sentence.",
    "2. Action line: one low-pressure action phrase.",
    "Each line should be 35 Korean characters or fewer when possible.",
    "Do not add a heading, intro, markdown, numbering, or extra explanation.",
    "",
    "CTA copy strategy:",
    "- Make it feel like the natural closing section of a detail page.",
    "- Encourage the next action gently, without hard-selling.",
    "- Avoid pushy commands like buying right now.",
    "- Let the selected tone decide whether the close is refined, emotional, minimal, or criteria-led.",
    "- Make the closing line and action line use the selected tone's sentence length, rhythm, and information amount.",
    "- Advertising-copy style is allowed.",
    "- Short fragments, noun phrases, and incomplete copy-style lines are allowed.",
    "- Do not invent effects, certifications, rankings, prices, discounts, or guarantees.",
    "- Do not use or closely imitate hard-selling phrases like '\uc9c0\uae08 \uad6c\ub9e4\ud558\uc138\uc694'.",
    "",
    "Selected tone rule:",
    getTonePromptRule(tone, "cta"),
    "",
    getCommonCopyRules(),
    "",
    "Product context:",
    `- Brand: ${product.brandName}`,
    `- Product: ${product.productName}`,
    `- Category: ${product.category}`,
    `- Target audience: ${product.targetAudience}`,
    `- Tone: ${tone}`,
    `- USP: ${product.usp}`,
    `- Forbidden phrases: ${product.forbiddenPhrases}`,
    `- Notes: ${product.notes}`,
  ].join("\n");
}
