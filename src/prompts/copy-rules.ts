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

export const COMMON_MINIMIZED_COPY_PATTERNS = [
  "~\ub192\uc74c",
  "~\uc801\uc74c",
  "~\uac15\ud654",
  "~\uac00\ub2a5",
  "~\uc9c0\uc6d0",
];

export function getCommonCopyRules() {
  return [
    "Common natural copy rules:",
    "- Keep the selected Tone System as the priority for rhythm, emotion, and information amount.",
    "- Write like a human ecommerce copywriter, not like generated summary notes.",
    "- Prefer complete, natural Korean sentences when the line is not a deliberate ad-copy fragment.",
    "- Convert shorthand claims into lived buyer value.",
    "- Example transformation: instead of '\uc2e4\uc0ac\uc6a9 \ub9cc\uc871\ub3c4 \ub192\uc74c', write '\uc0ac\uc6a9\ud560\uc218\ub85d \ub9cc\uc871\ub3c4\uac00 \uc790\uc5f0\uc2a4\ub7fd\uac8c \uc62c\ub77c\uac11\ub2c8\ub2e4.'",
    `- Minimize formal endings like ~${FORMAL_ENDING_IPNIDA} and ~${FORMAL_ENDING_SEUMNIDA}, unless the selected tone needs a composed sentence.`,
    `- Do not use these phrases: ${COMMON_BANNED_COPY_PHRASES.join(", ")}.`,
    `- Avoid note-like endings and patterns: ${COMMON_MINIMIZED_COPY_PATTERNS.join(", ")}.`,
    "- Avoid stacked nouns that sound like report labels. Turn them into a buyer-facing sentence.",
    "- Avoid generic AI-like praise, exaggerated claims, and absolute promises.",
  ].join("\n");
}
