import type { ProductInfo, Tone } from "@/src/types";
import { getToneInstruction } from "@/src/lib/tone-system";

const CUSTOMER_HONORIFIC = "\uace0\uac1d\ub2d8";
const FORMAL_ENDING_IPNIDA = "\uc785\ub2c8\ub2e4";
const FORMAL_ENDING_SEUMNIDA = "\uc2b5\ub2c8\ub2e4";
const BANNED_CTA_PHRASES = [
  "\uc9c0\uae08 \uad6c\ub9e4\ud558\uc138\uc694",
  "\ucd5c\uace0\uc758 \uc120\ud0dd",
  CUSTOMER_HONORIFIC,
  "\uc81c\uacf5\ud569\ub2c8\ub2e4",
].join(", ");

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
    "- Let the reader picture the expected change after real use.",
    "- Prefer concrete use moments, small benefits, and felt outcomes.",
    "- Keep the copy short, rhythmic, and easy to remember.",
    "- Advertising-copy style is allowed.",
    "- Short fragments, noun phrases, and incomplete copy-style lines are allowed.",
    `- Minimize formal endings like ~${FORMAL_ENDING_IPNIDA} and ~${FORMAL_ENDING_SEUMNIDA}.`,
    "- Avoid generic AI-like praise, exaggerated claims, and absolute promises.",
    "- Do not invent effects, certifications, rankings, prices, discounts, or guarantees.",
    `- Do not use or closely imitate these phrases: ${BANNED_CTA_PHRASES}.`,
    `- Match the selected tone strongly: ${getToneInstruction(tone, "cta")}.`,
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
