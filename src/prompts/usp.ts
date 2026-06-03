import type { ProductInfo, Tone } from "@/src/types";
import { getCommonCopyRules } from "@/src/prompts/copy-rules";
import { getTonePromptRule } from "@/src/prompts/tone-rules";

export function buildUspPrompt(product: ProductInfo, tone: Tone): string {
  return [
    "Create a Korean USP section for the middle of an ecommerce detail page.",
    "Output exactly 3 bullets.",
    "Each bullet must be 1 short sentence, 45 Korean characters or fewer when possible.",
    "Do not add a heading, intro, summary, markdown table, or extra explanation.",
    "",
    "USP copy strategy:",
    "- Write like detail-page copy, not a feature list.",
    "- Turn product strengths into buyer-facing value, but let the selected tone decide whether that value is emotional, minimal, refined, or criteria-based.",
    "- Make the 3 bullets differ in rhythm and sentence structure according to the selected tone.",
    "- Short fragments, noun phrases, and incomplete copy-style bullets are allowed.",
    "- Make each bullet feel like ad copy, not a product explanation.",
    "- Keep sentences short, concrete, and easy to read on mobile.",
    "- Avoid abstract words, broad claims, and generic AI-like praise.",
    "- Do not merely repeat specs or list functions with commas.",
    "- Do not invent effects, certifications, rankings, prices, discounts, or guarantees.",
    "- Keep the section compact because it sits between other detail-page sections.",
    "",
    "Selected tone rule:",
    getTonePromptRule(tone, "usp"),
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
    `- Specs: ${product.specs}`,
    `- Forbidden phrases: ${product.forbiddenPhrases}`,
    `- Notes: ${product.notes}`,
  ].join("\n");
}
