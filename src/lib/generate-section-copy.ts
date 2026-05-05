import type { DetailSectionDraft, ProductContextForm } from "@/src/types/detail-page";

function trimLines(s: string): string[] {
  return s
    .split("\n")
    .map((l) => l.replace(/^[\s\-•*]+/, "").trim())
    .filter(Boolean);
}

function toneLead(tone: ProductContextForm["tone"]): string {
  switch (tone) {
    case "professional":
      return "제품 스펙과 사용 맥락을 바탕으로 정리했습니다.";
    case "friendly":
      return "부담 없이 읽히도록 짧게 풀었습니다.";
    case "luxury":
      return "재질·완성도 중심으로 단정하게 전달합니다.";
    case "minimal":
      return "핵심만 남겼습니다.";
    default:
      return "";
  }
}

/**
 * 섹션 단위 카피 생성 (현재: 좌측 폼 컨텍스트 기반 로컬 조합).
 * 추후 LLM/API 연동 시 이 함수 본문만 교체하면 됩니다.
 */
export function generateSectionCopy(
  product: ProductContextForm,
  section: Pick<DetailSectionDraft, "kind" | "label">,
): string {
  const uspLines = trimLines(product.usp);
  const specLines = trimLines(product.specs);
  const lead = toneLead(product.tone);
  const target =
    product.targetAudience.trim().slice(0, 120) +
    (product.targetAudience.trim().length > 120 ? "…" : "");

  switch (section.kind) {
    case "hero": {
      const hook =
        uspLines[0] ??
        `${product.category} 카테고리에서 일상 활용을 넓히는 선택`;
      return [
        `${product.brandName} — ${hook}`,
        "",
        `${product.productName}`,
        `${product.category} · 타깃: ${target || "표기 없음"}`,
        "",
        lead,
      ].join("\n");
    }
    case "spec": {
      const bulletsUs = uspLines.slice(0, 6).map((l) => `• ${l}`);
      const bulletsSp = specLines.slice(0, 8).map((l) => `• ${l}`);
      const bodyParts = [`[차별 포인트]`, ...bulletsUs];
      if (bulletsSp.length) {
        bodyParts.push("", `[스펙·구성 참고]`, ...bulletsSp);
      }
      if (product.forbiddenPhrases.trim()) {
        bodyParts.push(
          "",
          `[표기 주의]`,
          ...product.forbiddenPhrases
            .trim()
            .split("\n")
            .filter(Boolean)
            .map((l) => `· ${l.trim()}`),
        );
      }
      return bodyParts.join("\n");
    }
    case "compare": {
      return [
        `[기존 방식에 대한 일반적 불편]`,
        `• 보온을 위해 두꺼워지면 활동·착탈이 번거로울 수 있음`,
        `• 세탁·관리가 까다로운 구조는 유지 비용이 커질 수 있음`,
        "",
        `[${product.productName} 관점에서의 제안]`,
        ...uspLines.slice(0, 4).map((l) => `• ${l}`),
        "",
        lead,
      ].join("\n");
    }
    case "faq": {
      return [
        `Q. 어떤 분께 맞나요?`,
        `A. ${target || "타깃 정보를 좌측 폼에 적어 주시면 문장을 구체화할 수 있습니다."}`,
        "",
        `Q. 관리·세탁은 어떻게 하나요?`,
        `A. ${specLines.find((l) => /세탁|손세탁|분리/i.test(l)) ?? "스펙에 적힌 세탁 방법을 우선합니다. 공급사 지침이 있으면 그에 따릅니다."}`,
        "",
        `Q. 표기·인증은 어떻게 하나요?`,
        `A. ${product.legalNotes.trim() ? "내부 법무 메모를 실제 판매 채널 규격에 맞게 반드시 치환·검수하세요." : "실제 판매 전 법적 표기·인증 번호를 반드시 확인하세요."}`,
      ].join("\n");
    }
    case "cta": {
      return [
        `[구매·문의 안내]`,
        `• 상품: ${product.productName}`,
        `• 카테고리: ${product.category}`,
        `• 의뢰사: ${product.clientName}`,
        "",
        `프로젝트: ${product.projectName}`,
        "",
        `교환·반품·A/S는 판매 채널 정책을 따릅니다. 본 카피는 초안이며 최종 게시 전 검수가 필요합니다.`,
      ].join("\n");
    }
    default:
      return section.label;
  }
}
