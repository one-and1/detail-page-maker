import type { ProductInfo, SectionKind } from "@/src/types";

export type CategoryRuleSectionKind = Extract<SectionKind, "hero" | "usp" | "cta">;

type CategoryRule = {
  id: string;
  label: string;
  matchTerms: string[];
  sellingPoints: string[];
  persuasionMethod: string;
  bannedDirections: string[];
  sectionStrategy: Record<CategoryRuleSectionKind, string>;
};

const categoryRules: CategoryRule[] = [
  {
    id: "fashion",
    label: "\ud328\uc158",
    matchTerms: [
      "\ud328\uc158",
      "\uc758\ub958",
      "\uc637",
      "\uc544\uc6b0\ud130",
      "\uc0c1\uc758",
      "\ud558\uc758",
      "\uc2e0\ubc1c",
      "\uac00\ubc29",
      "\uc561\uc138\uc11c\ub9ac",
    ],
    sellingPoints: ["\uc2a4\ud0c0\uc77c", "\ubd84\uc704\uae30", "\uc790\uc2e0\uac10", "\ud54f"],
    persuasionMethod: "\uc785\uc5c8\uc744 \ub54c \uc5b4\ub5bb\uac8c \ubcf4\uc774\ub294\uac00\ub97c \uae30\uc900\uc73c\ub85c \uc124\ub4dd\ud55c\ub2e4.",
    bannedDirections: [
      "\uc131\ub2a5 \uc911\uc2ec \uc124\uba85\uc744 \uc0ac\uc6a9\ud558\uc9c0 \ub9d0 \uac83",
      "\uc2a4\ud399\uc744 \uae30\ub2a5\ud45c\ucc98\ub7fc \ub098\uc5f4\ud558\uc9c0 \ub9d0 \uac83",
    ],
    sectionStrategy: {
      hero: "\uccab\uc778\uc0c1\uc740 \uc0c1\ud488 \uc124\uba85\ubcf4\ub2e4 \ucc29\uc6a9 \ud6c4 \ubcf4\uc774\ub294 \uc2e4\ub8e8\uc5e3, \ubd84\uc704\uae30, \uc790\uc2e0\uac10\uc73c\ub85c \uc5f0\ub2e4.",
      usp: "\uac01 USP\ub97c \uae30\ub2a5\uc774 \uc544\ub2c8\ub77c \ud54f\uc774 \uc0b4\uc544\ub098\ub294 \uc9c0\uc810, \uc2a4\ud0c0\uc77c \uc644\uc131, \ucc29\uc6a9 \uc7a5\uba74\uc758 \ubcc0\ud654\ub85c \ubc14\uafbc\ub2e4.",
      cta: "\uad6c\ub9e4 \uc555\ubc15 \ub300\uc2e0 \ub0b4\uac00 \uc785\uc5c8\uc744 \ub54c\uc758 \ubaa8\uc2b5\uacfc \ub2e4\uc74c \uc678\ucd9c\uc758 \uae30\ub300\uac10\uc744 \ub0a8\uae34\ub2e4.",
    },
  },
  {
    id: "healthFood",
    label: "\uac74\uac15\uc2dd\ud488",
    matchTerms: [
      "\uac74\uac15\uc2dd\ud488",
      "\uac74\uae30\uc2dd",
      "\uc601\uc591\uc81c",
      "\uc601\uc591",
      "\uc720\uc0b0\uade0",
      "\ube44\ud0c0\ubbfc",
      "\uc601\uc591\uc2dd",
      "\uc774\ub108\ubdf0\ud2f0",
    ],
    sellingPoints: ["\uafb8\uc900\ud568", "\ub8e8\ud2f4", "\uc2b5\uad00", "\uac74\uac15 \uad00\ub9ac"],
    persuasionMethod: "\ub9e4\uc77c \uc774\uc5b4\uac00\uae30 \uc26c\uc6b4\uac00\ub97c \uae30\uc900\uc73c\ub85c \uc124\ub4dd\ud55c\ub2e4.",
    bannedDirections: [
      "\uc9c8\ubcd1 \uc608\ubc29, \uce58\ub8cc, \uc644\ud654 \ub4f1 \uc758\ub8cc\ud6a8\ub2a5 \ud45c\ud604\uc744 \uc0ac\uc6a9\ud558\uc9c0 \ub9d0 \uac83",
      "\uc989\uac01 \ud6a8\uacfc \ud45c\ud604\uc774\ub098 \ud655\uc815\uc801\uc778 \uc2e0\uccb4 \ubcc0\ud654\ub97c \ubcf4\uc7a5\ud558\uc9c0 \ub9d0 \uac83",
    ],
    sectionStrategy: {
      hero: "\uccab\uc778\uc0c1\uc740 \ud6a8\ub2a5 \uc57d\uc18d\uc774 \uc544\ub2c8\ub77c \uc624\ub298\ub3c4 \ubd80\ub2f4 \uc5c6\uc774 \uc774\uc5b4\uc9c0\ub294 \uac74\uac15 \uad00\ub9ac \ub8e8\ud2f4\uc73c\ub85c \uc5f0\ub2e4.",
      usp: "\uac01 USP\ub97c \uafb8\uc900\ud788 \ucc59\uae30\uae30 \uc26c\uc6b4 \uc774\uc720, \ub8e8\ud2f4\uc5d0 \ub4e4\uc5b4\uc624\ub294 \ud3b8\uc758, \uc2b5\uad00 \uc720\uc9c0\uc758 \uc548\uc815\uac10\uc73c\ub85c \ubc14\uafbc\ub2e4.",
      cta: "\uadf9\uc801\uc778 \ubcc0\ud654\ubcf4\ub2e4 \uc624\ub298\ubd80\ud130 \uacc4\uc18d \ucc59\uae38 \uc218 \uc788\ub2e4\ub294 \uae30\ub300\uac10\uc73c\ub85c \ub2eb\ub294\ub2e4.",
    },
  },
  {
    id: "electronics",
    label: "\uc804\uc790\uc81c\ud488",
    matchTerms: [
      "\uc804\uc790\uc81c\ud488",
      "\uc804\uc790",
      "\uac00\uc804",
      "\ub514\uc9c0\ud138",
      "\uae30\uae30",
      "\ub514\ubc14\uc774\uc2a4",
      "\ucda9\uc804",
      "\uc2a4\ub9c8\ud2b8",
      "\uc561\uc138\uc11c\ub9ac",
    ],
    sellingPoints: ["\uc131\ub2a5", "\ud6a8\uc728", "\uc2dc\uac04 \uc808\uc57d", "\uc0dd\uc0b0\uc131"],
    persuasionMethod: "\uc5bc\ub9c8\ub098 \ud3b8\ud574\uc9c0\ub294\uac00\ub97c \uae30\uc900\uc73c\ub85c \uc124\ub4dd\ud55c\ub2e4.",
    bannedDirections: [
      "\uac10\uc131 \uc704\uc8fc \uce74\ud53c\ub97c \uacfc\ub3c4\ud558\uac8c \uc0ac\uc6a9\ud558\uc9c0 \ub9d0 \uac83",
      "\uc81c\uacf5\ub41c \uc2a4\ud399 \uc5c6\uc774 \uc131\ub2a5, \uc18d\ub3c4, \ud638\ud658\uc131\uc744 \ub9cc\ub4e4\uc5b4\ub0b4\uc9c0 \ub9d0 \uac83",
    ],
    sectionStrategy: {
      hero: "\uccab\uc778\uc0c1\uc740 \uac10\uc131 \ubd84\uc704\uae30\ubcf4\ub2e4 \uc791\uc5c5, \uc0ac\uc6a9 \ud750\ub984, \ub300\uae30 \uc2dc\uac04, \ubc18\ubcf5 \uc218\uace0\uac00 \uc904\uc5b4\ub4dc\ub294 \ubcc0\ud654\ub85c \uc5f0\ub2e4.",
      usp: "\uac01 USP\ub97c \uc131\ub2a5 \uc218\uce58 \uc790\uccb4\ubcf4\ub2e4 \ub354 \ube60\ub978 \ucc98\ub9ac, \ub35c \ubc88\uac70\ub85c\uc6b4 \uc870\uc791, \uc0dd\uc0b0\uc131 \ud5a5\uc0c1\uc73c\ub85c \ubc14\uafbc\ub2e4.",
      cta: "\ub0b4 \uc0ac\uc6a9 \ud658\uacbd\uc774 \uc5bc\ub9c8\ub098 \ud3b8\ud574\uc9c8\uc9c0 \uae30\ub300\ud558\uac8c \ud558\uba70 \ucc28\ubd84\ud788 \ud655\uc778\ud558\ub3c4\ub85d \ub2eb\ub294\ub2e4.",
    },
  },
  {
    id: "pet",
    label: "\ubc18\ub824\ub3d9\ubb3c",
    matchTerms: [
      "\ubc18\ub824\ub3d9\ubb3c",
      "\ubc18\ub824",
      "\ud398\ud2b8",
      "\uac15\uc544\uc9c0",
      "\uace0\uc591\uc774",
      "\uc560\uacac",
      "\uc560\ubb18",
      "\ubc18\ub824\uacac",
      "\ubc18\ub824\ubb18",
    ],
    sellingPoints: ["\uc548\uc2ec", "\ucf00\uc5b4", "\ubcf4\ud638", "\ud3b8\uc548\ud568"],
    persuasionMethod: "\uc6b0\ub9ac \uc544\uc774\uc5d0\uac8c \uad1c\ucc2e\uc740\uac00\ub97c \uae30\uc900\uc73c\ub85c \uc124\ub4dd\ud55c\ub2e4.",
    bannedDirections: [
      "\uc0ac\ub78c \uc911\uc2ec \ud45c\ud604\uc73c\ub85c \ubcf4\ud638\uc790 \ud3b8\uc758\ub9cc \uc55e\uc138\uc6b0\uc9c0 \ub9d0 \uac83",
      "\ubc18\ub824\ub3d9\ubb3c\uc758 \uac74\uac15, \ud589\ub3d9, \uc548\uc804\uc744 \ubcf4\uc7a5\ud558\uc9c0 \ub9d0 \uac83",
      "\ubcf4\ud638\uc790\uc758 \ubd88\uc548\uc744 \uacfc\ub3c4\ud558\uac8c \uc790\uadf9\ud558\uc9c0 \ub9d0 \uac83",
    ],
    sectionStrategy: {
      hero: "\uccab\uc778\uc0c1\uc740 \ubcf4\ud638\uc790\uc758 \ucde8\ud5a5\ubcf4\ub2e4 \ubc18\ub824\ub3d9\ubb3c\uc774 \ud3b8\uc548\ud558\uac8c \uc4f0\ub294 \uc7a5\uba74\uacfc \uc548\uc2ec\uac10\uc73c\ub85c \uc5f0\ub2e4.",
      usp: "\uac01 USP\ub97c \uc6b0\ub9ac \uc544\uc774\uc5d0\uac8c \ub2ff\ub294 \ucf00\uc5b4, \ubcf4\ud638, \ud3b8\uc548\ud568, \ubd80\ub2f4 \uc5c6\ub294 \uc0ac\uc6a9\uac10\uc73c\ub85c \ubc14\uafbc\ub2e4.",
      cta: "\ubcf4\ud638\uc790 \uc911\uc2ec \uad6c\ub9e4 \uc720\ub3c4\ubcf4\ub2e4 \uc544\uc774\uac00 \ud3b8\uc548\ud560 \ub2e4\uc74c \uc21c\uac04\uc758 \uae30\ub300\uac10\uc73c\ub85c \ub2eb\ub294\ub2e4.",
    },
  },
  {
    id: "living",
    label: "\uc0dd\ud65c\uc6a9\ud488",
    matchTerms: [
      "\uc0dd\ud65c\uc6a9\ud488",
      "\uc0dd\ud65c",
      "\uc8fc\ubc29",
      "\uccad\uc18c",
      "\uc218\ub0a9",
      "\uc0b4\ub9bc",
      "\uc77c\uc0c1",
      "\uad00\ub9ac",
      "\ud648",
    ],
    sellingPoints: ["\ud3b8\ub9ac\ud568", "\uc2e4\uc6a9\uc131", "\uad00\ub9ac", "\uc77c\uc0c1"],
    persuasionMethod: "\ub9e4\uc77c \uc5bc\ub9c8\ub098 \ud3b8\ud55c\uac00\ub97c \uae30\uc900\uc73c\ub85c \uc124\ub4dd\ud55c\ub2e4.",
    bannedDirections: [
      "\uacfc\uc7a5\ub41c \uac10\uc131 \ud45c\ud604\uc744 \uc0ac\uc6a9\ud558\uc9c0 \ub9d0 \uac83",
      "\uc77c\uc0c1 \ubb38\uc81c\ub97c \uacfc\uc7a5\ud558\uac70\ub098 \ud544\uc218\ud488\ucc98\ub7fc \ub2e8\uc815\ud558\uc9c0 \ub9d0 \uac83",
      "\uc81c\uacf5\ub41c \uadfc\uac70 \uc5c6\uc774 \ub0b4\uad6c\uc131, \uc704\uc0dd, \uc808\uc57d \ud6a8\uacfc\ub97c \ubcf4\uc7a5\ud558\uc9c0 \ub9d0 \uac83",
    ],
    sectionStrategy: {
      hero: "\uccab\uc778\uc0c1\uc740 \uac70\ucc3d\ud55c \uac10\uc131\ubcf4\ub2e4 \ub9e4\uc77c \ubc18\ubcf5\ub418\ub294 \ubd88\ud3b8\uc774 \uc904\uc5b4\ub4dc\ub294 \uc2e4\uc81c \uc0ac\uc6a9 \uc7a5\uba74\uc73c\ub85c \uc5f0\ub2e4.",
      usp: "\uac01 USP\ub97c \uad00\ub9ac\uac00 \uc26c\uc6cc\uc9c0\ub294 \uc774\uc720, \uc190\uc774 \ub35c \uac00\ub294 \ub3d9\uc120, \ubc18\ubcf5 \uc0ac\uc6a9\uc758 \uc2e4\uc6a9\uc131\uc73c\ub85c \ubc14\uafbc\ub2e4.",
      cta: "\ub9e4\uc77c\uc758 \uc791\uc740 \uc218\uace0\uac00 \uc904\uc5b4\ub4dc\ub294 \uae30\ub300\uac10\uc73c\ub85c \ub2f4\ubc31\ud558\uac8c \ub2eb\ub294\ub2e4.",
    },
  },
];

function normalizeCategory(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function getCategoryRule(category: string): CategoryRule | null {
  const normalizedCategory = normalizeCategory(category);

  if (!normalizedCategory) {
    return null;
  }

  return (
    categoryRules.find((rule) =>
      rule.matchTerms.some((term) => normalizedCategory.includes(term.toLowerCase())),
    ) ?? null
  );
}

export function getCategoryPromptRule(
  product: ProductInfo,
  sectionKind: CategoryRuleSectionKind,
) {
  const rule = getCategoryRule(product.category);

  if (!rule) {
    return [
      "Category copy strategy:",
      "- No predefined category rule matched. Use only the provided category slot and the selected Tone System.",
    ].join("\n");
  }

  return [
    "Category copy strategy:",
    `- Matched category: ${rule.label}`,
    "- Apply these category rules inside the selected Tone System. The tone still controls rhythm, emotion level, sentence length, and information density.",
    "- Do not solve the category by swapping nouns only. Change the persuasion logic and buyer expectation for this section.",
    `- What this category sells: ${rule.sellingPoints.join(", ")}`,
    `- Persuasion method: ${rule.persuasionMethod}`,
    `- Section direction: ${rule.sectionStrategy[sectionKind]}`,
    `- Banned category directions: ${rule.bannedDirections.join(" / ")}`,
  ].join("\n");
}
