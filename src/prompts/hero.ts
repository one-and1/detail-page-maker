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
      return "plain, direct, and copy-like";
    case "friendly":
      return `warm and conversational, without saying ${CUSTOMER_HONORIFIC}`;
    case "premium":
      return "calm and polished, without premium or luxury cliches";
    case "minimal":
      return "very concise, restrained, and rhythmic";
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
    "- Prefer rhythmic short copy over explanatory prose.",
    "- Short fragments, noun phrases, and incomplete copy-style lines are allowed.",
    `- Minimize formal endings like ~${FORMAL_ENDING_IPNIDA} and ~${FORMAL_ENDING_SEUMNIDA}.`,
    "- Make it feel like an ad headline and subcopy, not a product explanation.",
    "- Prefer concrete scenes and felt changes over feature descriptions.",
    "- Avoid abstract brand slogans and AI-like generic claims.",
    `- Do not use these phrases: ${BANNED_COPY_PHRASES}.`,
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
