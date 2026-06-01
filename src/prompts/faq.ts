import type { ProductInfo, Tone } from "@/src/types";
import { getToneInstruction } from "@/src/lib/tone-system";

const CUSTOMER_HONORIFIC = "\uace0\uac1d\ub2d8";
const FORMAL_ENDING_IPNIDA = "\uc785\ub2c8\ub2e4";
const FORMAL_ENDING_SEUMNIDA = "\uc2b5\ub2c8\ub2e4";
const BANNED_FAQ_PHRASES = [
  "\ud601\uc2e0\uc801\uc778",
  "\ucd5c\uace0\uc758",
  CUSTOMER_HONORIFIC,
  "\uc81c\uacf5\ud569\ub2c8\ub2e4",
].join(", ");

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
    `- Minimize formal endings like ~${FORMAL_ENDING_IPNIDA} and ~${FORMAL_ENDING_SEUMNIDA}.`,
    "- Avoid generic AI-like phrasing, slogans, and sales pressure.",
    "- Do not invent effects, certifications, rankings, prices, discounts, delivery guarantees, warranty terms, or policies not provided.",
    "- If shipping, warranty, or exact policy details are not provided, answer cautiously without making up specifics.",
    `- Do not use these phrases: ${BANNED_FAQ_PHRASES}.`,
    `- Match the selected tone strongly: ${getToneInstruction(tone, "faq")}.`,
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
