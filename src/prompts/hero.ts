import type { ProductInfo, Tone } from "@/src/types";
import { getCommonCopyRules } from "@/src/prompts/copy-rules";
import { getTonePromptRule } from "@/src/prompts/tone-rules";

export function buildHeroPrompt(product: ProductInfo, tone: Tone): string {
  return [
    "Create a Korean ecommerce hero section for the first screen of a detail page.",
    "Output exactly 2 lines:",
    "1. Hook headline: 16 Korean characters or fewer when possible.",
    "2. Supporting sentence: 35 Korean characters or fewer when possible.",
    "",
    "Hero copy strategy:",
    "- Build only the first-screen hook and subcopy.",
    "- Let the selected tone decide whether the hook starts from value, emotion, clarity, or criteria.",
    "- Make the sentence structure visibly match the selected tone, not only the vocabulary.",
    "- Short fragments, noun phrases, and incomplete copy-style lines are allowed.",
    "- Make it feel like an ad headline and subcopy, not a product explanation.",
    "- Avoid turning the hero into a feature list.",
    "- Avoid abstract brand slogans and AI-like generic claims.",
    "- Do not over-explain. This is only the first screen.",
    "",
    "Selected tone rule:",
    getTonePromptRule(tone, "hero"),
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
