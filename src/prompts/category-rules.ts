import type { ProductInfo, SectionKind } from "@/src/types";

export type CategoryRuleSectionKind = Extract<SectionKind, "hero" | "usp" | "cta">;

type CategoryRule = {
  id: string;
  label: string;
  matchTerms: string[];
  focusTerms: string[];
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
    focusTerms: ["\ud54f", "\uc2a4\ud0c0\uc77c", "\ubd84\uc704\uae30", "\ucc29\uc6a9 \uacbd\ud5d8", "\ud2b8\ub80c\ub4dc"],
    bannedDirections: [
      "\uc131\ub2a5 \uc911\uc2ec \uce74\ud53c\ub97c \uacfc\ub3c4\ud558\uac8c \uc0ac\uc6a9\ud558\uc9c0 \ub9d0 \uac83",
      "\uc2a4\ud399\uc744 \uae30\ub2a5\ud45c\ucc98\ub7fc \ub098\uc5f4\ud558\uc9c0 \ub9d0 \uac83",
    ],
    sectionStrategy: {
      hero: "\ud54f, \ubd84\uc704\uae30, \ucc29\uc6a9 \uc21c\uac04\uc744 \uba3c\uc800 \ubcf4\uc5ec\uc8fc\uace0 \uc0c1\ud488 \uc124\uba85\uc740 \uc904\uc778\ub2e4.",
      usp: "\uac01 USP\ub97c \uc2a4\ud0c0\uc77c, \ud54f, \ucc29\uc6a9\uac10, \ucf54\ub514 \uc0c1\ud669 \uc911 \ud558\ub098\uc758 \uad6c\ub9e4 \uac00\uce58\ub85c \ubc14\uafbc\ub2e4.",
      cta: "\uc0ac\uc6a9\uc790\uac00 \uc785\uc5c8\uc744 \ub54c\uc758 \ubd84\uc704\uae30\uc640 \uc120\ud0dd \ud655\uc2e0\uc73c\ub85c \ubd80\ub4dc\ub7fd\uac8c \ub2eb\ub294\ub2e4.",
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
    focusTerms: ["\uafb8\uc900\ud568", "\uac74\uac15 \uc2b5\uad00", "\ub8e8\ud2f4", "\uccb4\uac10 \ubcc0\ud654", "\uc2e0\ub8b0"],
    bannedDirections: [
      "\uc9c8\ubcd1 \uc608\ubc29, \uce58\ub8cc, \uc644\ud654 \ub4f1 \uc758\ub8cc\ud6a8\ub2a5 \ud45c\ud604\uc744 \uc0ac\uc6a9\ud558\uc9c0 \ub9d0 \uac83",
      "\ud655\uc815\uc801\uc778 \uc2e0\uccb4 \ubcc0\ud654\ub098 \ud6a8\uacfc\ub97c \ubcf4\uc7a5\ud558\uc9c0 \ub9d0 \uac83",
    ],
    sectionStrategy: {
      hero: "\ud6a8\ub2a5 \ubcf4\uc7a5 \ub300\uc2e0 \ub9e4\uc77c \uc774\uc5b4\uac00\uae30 \uc26c\uc6b4 \ub8e8\ud2f4\uacfc \uac74\uac15 \uc2b5\uad00\uc744 \uc5f4\uc5b4\uc900\ub2e4.",
      usp: "\uafb8\uc900\ud568, \uc12d\ucde8 \ud3b8\uc758, \uc2b5\uad00\ud654, \uc2e0\ub8b0 \uc694\uc18c \uc911\uc2ec\uc73c\ub85c \uac01 \uac15\uc810\uc744 \uc804\ud658\ud55c\ub2e4.",
      cta: "\ud06c\uac8c \ubc14\uafb8\ub294 \uc57d\uc18d\ubcf4\ub2e4 \uc624\ub298\ubd80\ud130 \uc774\uc5b4\uac00\ub294 \uac74\uac15 \ub8e8\ud2f4\uc73c\ub85c \ub2eb\ub294\ub2e4.",
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
    focusTerms: ["\uc131\ub2a5", "\ud6a8\uc728", "\ud3b8\uc758\uc131", "\uc0dd\uc0b0\uc131", "\uae30\ub2a5"],
    bannedDirections: [
      "\uac10\uc131 \uc704\uc8fc \uce74\ud53c\ub97c \uacfc\ub3c4\ud558\uac8c \uc0ac\uc6a9\ud558\uc9c0 \ub9d0 \uac83",
      "\uc81c\uacf5\ub41c \uc2a4\ud399 \uc5c6\uc774 \uc131\ub2a5, \uc18d\ub3c4, \ud638\ud658\uc131\uc744 \ub9cc\ub4e4\uc5b4\ub0b4\uc9c0 \ub9d0 \uac83",
    ],
    sectionStrategy: {
      hero: "\uac10\uc131\uc801 \uc7a5\uba74\ubcf4\ub2e4 \uc0ac\uc6a9 \ubb38\uc81c, \uc131\ub2a5 \uc774\uc810, \uc2dc\uac04 \uc808\uc57d\uc744 \uba3c\uc800 \ub4dc\ub7ec\ub0b8\ub2e4.",
      usp: "\uae30\ub2a5 \ub098\uc5f4\uc774 \uc544\ub2c8\ub77c \ud6a8\uc728, \ud3b8\uc758\uc131, \uc0dd\uc0b0\uc131, \uc0ac\uc6a9 \ud750\ub984\uc758 \uac1c\uc120\uc73c\ub85c \ubc14\uafbc\ub2e4.",
      cta: "\uad6c\ub9e4 \uc555\ubc15\ubcf4\ub2e4 \ud544\uc694\ud55c \uae30\ub2a5\uacfc \uc0ac\uc6a9 \uc870\uac74\uc744 \ud655\uc778\ud558\ub294 \ubc29\ud5a5\uc73c\ub85c \uc720\ub3c4\ud55c\ub2e4.",
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
    focusTerms: ["\uc548\uc804", "\ucf00\uc5b4", "\ubcf4\ud638", "\ud3b8\uc548\ud568", "\uc2e0\ub8b0"],
    bannedDirections: [
      "\ubc18\ub824\ub3d9\ubb3c\uc758 \uac74\uac15, \ud589\ub3d9, \uc548\uc804\uc744 \ubcf4\uc7a5\ud558\uc9c0 \ub9d0 \uac83",
      "\ubcf4\ud638\uc790\uc758 \ubd88\uc548\uc744 \uacfc\ub3c4\ud558\uac8c \uc790\uadf9\ud558\uc9c0 \ub9d0 \uac83",
    ],
    sectionStrategy: {
      hero: "\uc0ac\ub791\uc2a4\ub7ec\uc6b4 \uac10\uc815\ubcf4\ub2e4 \uc548\uc804, \ud3b8\uc548\ud568, \ubcf4\ud638\uc790\uc758 \uc548\uc2ec\uc744 \uac04\uacb0\ud788 \uc55e\uc138\uc6b4\ub2e4.",
      usp: "\uac01 \uac15\uc810\uc744 \ucf00\uc5b4, \ubcf4\ud638, \uc0ac\uc6a9 \ud3b8\uc548\ud568, \uc2e0\ub8b0\ub85c \ubc14\uafb8\ub418 \ubcf4\uc7a5 \ud45c\ud604\uc740 \ud53c\ud55c\ub2e4.",
      cta: "\ubc18\ub824\ub3d9\ubb3c\uacfc \ubcf4\ud638\uc790 \ubaa8\ub450\uc758 \ud3b8\uc548\ud55c \ub2e4\uc74c \uc0ac\uc6a9 \uc21c\uac04\uc73c\ub85c \ub9c8\ubb34\ub9ac\ud55c\ub2e4.",
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
    focusTerms: ["\uc2e4\uc6a9\uc131", "\ud3b8\ub9ac\ud568", "\uc77c\uc0c1", "\uad00\ub9ac", "\uc0ac\uc6a9 \uacbd\ud5d8"],
    bannedDirections: [
      "\uc77c\uc0c1 \ubb38\uc81c\ub97c \uacfc\uc7a5\ud558\uac70\ub098 \ud544\uc218\ud488\ucc98\ub7fc \ub2e8\uc815\ud558\uc9c0 \ub9d0 \uac83",
      "\uc81c\uacf5\ub41c \uadfc\uac70 \uc5c6\uc774 \ub0b4\uad6c\uc131, \uc704\uc0dd, \uc808\uc57d \ud6a8\uacfc\ub97c \ubcf4\uc7a5\ud558\uc9c0 \ub9d0 \uac83",
    ],
    sectionStrategy: {
      hero: "\uc77c\uc0c1\uc758 \ubc88\uac70\ub85c\uc6c0\uc744 \uc5b4\ub5bb\uac8c \uc904\uc774\ub294\uc9c0 \ud3b8\ub9ac\ud568\uacfc \uc0ac\uc6a9 \uc21c\uac04\uc73c\ub85c \uc5f0\ub2e4.",
      usp: "\uc2e4\uc6a9\uc131, \uad00\ub9ac \uc26c\uc6c0, \ubc18\ubcf5 \uc0ac\uc6a9, \uc77c\uc0c1 \ub3d9\uc120 \uac1c\uc120\uc73c\ub85c \uac01 \uac15\uc810\uc744 \uc804\ud658\ud55c\ub2e4.",
      cta: "\uc0ac\uc6a9\uc790\uc758 \ub9e4\uc77c \ub3d9\uc120\uc774 \uc870\uae08 \ub354 \ud3b8\ud574\uc9c0\ub294 \ubc29\ud5a5\uc73c\ub85c \ubd80\ub2f4 \uc5c6\uc774 \ub2eb\ub294\ub2e4.",
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
    "- Apply these category rules after the selected Tone System. Do not change the selected tone's rhythm, emotion level, or information density.",
    `- Category focus terms: ${rule.focusTerms.join(", ")}`,
    `- Section direction: ${rule.sectionStrategy[sectionKind]}`,
    `- Banned category directions: ${rule.bannedDirections.join(" / ")}`,
  ].join("\n");
}
