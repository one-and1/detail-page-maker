import type { ProductInfo, Tone } from "@/src/types";

function getToneInstruction(tone: Tone): string {
  switch (tone) {
    case "clear":
      return "plain, specific, and easy to scan";
    case "friendly":
      return "warm and conversational, like a helpful seller";
    case "premium":
      return "calm and polished, without luxury or status cliches";
    case "minimal":
      return "very concise, restrained, and uncluttered";
  }
}

export function buildUspPrompt(product: ProductInfo, tone: Tone): string {
  return [
    "Create a Korean USP section for the middle of an ecommerce detail page.",
    "Output exactly 3 bullets.",
    "Each bullet must be 1 short sentence, 45 Korean characters or fewer when possible.",
    "Do not add a heading, intro, summary, markdown table, or extra explanation.",
    "",
    "USP copy strategy:",
    "- Write like detail-page copy, not a feature list.",
    "- Start from a real use moment, routine, inconvenience, or buyer concern.",
    "- Turn product strengths into changes the buyer can feel in daily use.",
    "- Keep sentences short, concrete, and easy to read on mobile.",
    "- Avoid abstract words, broad claims, and generic AI-like praise.",
    "- Do not merely repeat specs or list functions with commas.",
    "- Do not invent effects, certifications, rankings, prices, discounts, or guarantees.",
    "- Keep the section compact because it sits between other detail-page sections.",
    "- Do not use these phrases: 혁신적인, 최고의, 프리미엄.",
    `- Match the tone: ${getToneInstruction(tone)}.`,
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
