import type { ProductInfo, Tone } from "@/src/types";

const CUSTOMER_HONORIFIC = "\uace0\uac1d\ub2d8";
const FORMAL_ENDING_IPNIDA = "\uc785\ub2c8\ub2e4";
const FORMAL_ENDING_SEUMNIDA = "\uc2b5\ub2c8\ub2e4";
const BANNED_COPY_PHRASES = [
  "\ud601\uc2e0\uc801\uc778",
  "\ucd5c\uace0\uc758",
  "\ud504\ub9ac\ubbf8\uc5c4\ud55c",
  CUSTOMER_HONORIFIC,
  "\uc81c\uacf5\ud569\ub2c8\ub2e4",
].join(", ");

function getToneInstruction(tone: Tone): string {
  switch (tone) {
    case "clear":
      return "plain, specific, and easy to scan";
    case "friendly":
      return `warm and conversational, without saying ${CUSTOMER_HONORIFIC}`;
    case "premium":
      return "calm and polished, without premium or luxury cliches";
    case "minimal":
      return "very concise, restrained, and rhythmic";
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
    "- Prefer rhythmic short copy over explanatory prose.",
    "- Short fragments, noun phrases, and incomplete copy-style bullets are allowed.",
    `- Minimize formal endings like ~${FORMAL_ENDING_IPNIDA} and ~${FORMAL_ENDING_SEUMNIDA}.`,
    "- Make each bullet feel like ad copy, not a product explanation.",
    "- Keep sentences short, concrete, and easy to read on mobile.",
    "- Avoid abstract words, broad claims, and generic AI-like praise.",
    "- Do not merely repeat specs or list functions with commas.",
    "- Do not invent effects, certifications, rankings, prices, discounts, or guarantees.",
    "- Keep the section compact because it sits between other detail-page sections.",
    `- Do not use these phrases: ${BANNED_COPY_PHRASES}.`,
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
