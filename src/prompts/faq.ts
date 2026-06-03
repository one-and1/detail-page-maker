import type { ProductInfo, Tone } from "@/src/types";
import { getCommonCopyRules } from "@/src/prompts/copy-rules";
import { getTonePromptRule } from "@/src/prompts/tone-rules";

export function buildFaqPrompt(product: ProductInfo, tone: Tone): string {
  return [
    "Create a Korean FAQ section for an ecommerce detail page.",
    "Output 3 to 5 Q&A pairs.",
    "Use this plain text format for each pair:",
    "Q. short natural buyer question",
    "A. brief trustworthy answer",
    "Do not add a heading, intro, summary, markdown table, or extra explanation.",
    "",
    "FAQ copy strategy:",
    "- Prioritize questions real buyers would ask before purchase.",
    "- Use FAQ to reduce purchase anxiety, not to repeat ad copy.",
    "- Include practical use questions when relevant: shipping, how to use, expected effects, durability, care, storage, fit, size, compatibility, or precautions.",
    "- Make each question short, natural, and conversational.",
    "- Answer with grounded confidence, without exaggeration.",
    "- Prefer honest limits, conditions, and practical tips over broad claims.",
    "- Keep answers concise enough to scan on mobile.",
    "- Avoid generic AI-like phrasing, slogans, and sales pressure.",
    "- Do not invent effects, certifications, rankings, prices, discounts, delivery guarantees, warranty terms, or policies not provided.",
    "- If shipping, warranty, or exact policy details are not provided, answer cautiously without making up specifics.",
    "- Make question wording and answer structure visibly follow the selected tone.",
    "",
    "Selected tone rule:",
    getTonePromptRule(tone, "faq"),
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
