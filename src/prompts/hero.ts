import type { ProductInfo, Tone } from "@/src/types";

function getToneInstruction(tone: Tone): string {
  switch (tone) {
    case "clear":
      return "plain and direct";
    case "friendly":
      return "warm and conversational";
    case "premium":
      return "calm and polished, without luxury cliches";
    case "minimal":
      return "very concise and restrained";
  }
}

export function buildHeroPrompt(product: ProductInfo, tone: Tone): string {
  return [
    "Create a Korean ecommerce hero section for the first screen of a detail page.",
    "Output exactly 2 lines:",
    "1. Hook headline: 16 Korean characters or fewer when possible.",
    "2. Supporting sentence: 35 Korean characters or fewer when possible.",
    "",
    "Hero copy strategy:",
    "- Start from a real user situation, problem, or relatable moment.",
    "- Include a problem-raising or empathy-based hook.",
    "- Prefer short, concrete sentences.",
    "- Avoid abstract brand slogans and AI-like generic claims.",
    "- Do not use vague intensifiers such as 혁신적인, 최고의, 프리미엄한.",
    "- Do not over-explain. This is only the first screen.",
    `- Match the tone: ${getToneInstruction(tone)}.`,
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
