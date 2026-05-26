import type { ProductInfo, Tone } from "@/src/types";

export function buildHeroPrompt(product: ProductInfo, tone: Tone): string {
  return [
    "Create a concise hero section: one strong headline and one short supporting sentence.",
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
