import type { ProductInfo, Tone } from "@/src/types";

export function buildUspPrompt(product: ProductInfo, tone: Tone): string {
  return [
    "Create a USP section: 3 short benefit bullets focused on concrete product strengths.",
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
