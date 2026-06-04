const FORMAL_ENDING_IPNIDA = "\uc785\ub2c8\ub2e4";
const FORMAL_ENDING_SEUMNIDA = "\uc2b5\ub2c8\ub2e4";

export const COMMON_BANNED_COPY_PHRASES = [
  "\ucd5c\uace0\uc758",
  "\ud601\uc2e0\uc801\uc778",
  "\uace0\uac1d\ub2d8",
  "\uc81c\uacf5\ud569\ub2c8\ub2e4",
  "\ub9cc\uc871\ub3c4 \ub192\uc74c",
  "\uc0ac\uc6a9 \ud3b8\uc758\uc131 \uac15\ud654",
  "\uad00\ub9ac \ubd80\ub2f4 \uc801\uc74c",
  "\uc2e4\uc0ac\uc6a9 \ub9cc\uc871\ub3c4 \ub192\uc74c",
];

export const COMMON_MINIMIZED_EXPLANATORY_PHRASES = [
  "\ud569\ub2c8\ub2e4",
  "\uc2b5\ub2c8\ub2e4",
  "\uc81c\uacf5\ud569\ub2c8\ub2e4",
  "\uac00\ub2a5\ud569\ub2c8\ub2e4",
  "\uc9c0\uc6d0\ud569\ub2c8\ub2e4",
  "\ud5a5\uc0c1\ub429\ub2c8\ub2e4",
  "\uac1c\uc120\ub429\ub2c8\ub2e4",
];

export const COMMON_MINIMIZED_COPY_PATTERNS = [
  "~\ub192\uc74c",
  "~\uc801\uc74c",
  "~\uac15\ud654",
  "~\uac00\ub2a5",
  "~\uc9c0\uc6d0",
];

export const COMMON_ALLOWED_COPY_STYLES = [
  "\uc9e7\uc740 \ub2e8\ubb38",
  "\uc870\uac01 \uce74\ud53c",
  "\uba85\uc0ac\ud615 \uce74\ud53c",
  "\ub9ac\ub4ec\uac10 \uc788\ub294 \ubb38\uc7a5",
];

export function getCommonCopyRules() {
  return [
    "Common natural copy rules:",
    "- Keep the selected Tone System as the priority for rhythm, emotion, and information amount.",
    "- Write like a human ecommerce copywriter, not like generated summary notes or product documentation.",
    "- Prefer ad-copy rhythm over explanatory prose, especially for hero, USP, and CTA sections.",
    `- Actively allow these styles when they fit the selected tone: ${COMMON_ALLOWED_COPY_STYLES.join(", ")}.`,
    "- Complete Korean sentences are not required when a deliberate copy-style fragment sounds more natural.",
    "- Use line rhythm: one clear image, one felt benefit, or one compact decision point per line.",
    "- Convert shorthand claims into lived buyer value.",
    "- Example rhythm: '\ud558\ub8e8 \uc885\uc77c \uc785\uc5b4\ub3c4 \ub35c \ub2f5\ub2f5\ud558\uac8c.'",
    "- Example rhythm: '\ub9e4\uc77c \uc4f0\ub294 \uc81c\ud488\uc774\ub77c\uba74\\n\ucc28\uc774\uac00 \ub354 \ud06c\uac8c \ub290\uaef4\uc9d1\ub2c8\ub2e4.'",
    "- Example rhythm: '\ud544\uc694\ud55c \uac83\ub9cc \ub0a8\uae34 \uad6c\uc131.'",
    `- Minimize formal endings like ~${FORMAL_ENDING_IPNIDA} and ~${FORMAL_ENDING_SEUMNIDA}, unless the selected tone needs a composed sentence.`,
    `- Minimize explanatory phrases: ${COMMON_MINIMIZED_EXPLANATORY_PHRASES.join(", ")}.`,
    "- Replace explanatory verbs with more direct copy when possible: 'offers/provides/supports/improves/enhances' should become a felt use moment, benefit, or compact noun phrase.",
    `- Do not use these phrases: ${COMMON_BANNED_COPY_PHRASES.join(", ")}.`,
    `- Avoid note-like endings and patterns: ${COMMON_MINIMIZED_COPY_PATTERNS.join(", ")}.`,
    "- Avoid stacked nouns that sound like report labels. Turn them into buyer-facing copy with rhythm.",
    "- Avoid generic AI-like praise, exaggerated claims, and absolute promises.",
    "- FAQ may stay more informational and complete, but still avoid stiff, repetitive formal endings when a natural answer is possible.",
  ].join("\n");
}
