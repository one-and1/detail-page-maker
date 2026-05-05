/**
 * 자유 문장만으로 본문 전체를 덮어쓰지 않습니다.
 * 아래 접두어가 있는 지시만 허용해 부분 수정합니다.
 */

export type PartialRevisionResult =
  | { ok: true; body: string }
  | { ok: false; message: string };

const HELP =
  "추가: · 앞줄: · 삭제: · 교체:기존문구>>>새문구 (>>> 첫 번째 구분만 사용)";

function trimStartBom(s: string): string {
  return s.replace(/^\uFEFF/, "").replace(/^\s+/, "");
}

function stripOneLeadingNewline(s: string): string {
  if (s.startsWith("\r\n")) return s.slice(2);
  if (s.startsWith("\n")) return s.slice(1);
  return s;
}

export function applyPartialSectionRevision(
  currentBody: string,
  instruction: string,
): PartialRevisionResult {
  const s = trimStartBom(instruction);
  if (!s) {
    return { ok: false, message: "수정 지시를 입력하세요." };
  }

  if (s.startsWith("추가:")) {
    const rest = stripOneLeadingNewline(s.slice("추가:".length)).replace(/^\s+/, "");
    if (!rest.trim()) {
      return { ok: false, message: "«추가:» 뒤에 붙일 문단을 적어 주세요." };
    }
    const block = rest.trimEnd();
    const trimmed = currentBody.trimEnd();
    const next = trimmed === "" ? block : `${trimmed}\n\n${block}`;
    return { ok: true, body: next };
  }

  if (s.startsWith("앞줄:")) {
    const rest = stripOneLeadingNewline(s.slice("앞줄:".length)).replace(/^\s+/, "");
    if (!rest.trim()) {
      return { ok: false, message: "«앞줄:» 뒤에 맨 앞에 붙일 문장을 적어 주세요." };
    }
    const head = rest.trimEnd();
    const trimmed = currentBody.trimStart();
    const next = trimmed === "" ? head : `${head}\n\n${trimmed}`;
    return { ok: true, body: next };
  }

  if (s.startsWith("삭제:")) {
    let target = s.slice("삭제:".length);
    target = stripOneLeadingNewline(target);
    if (!target) {
      return { ok: false, message: "«삭제:» 뒤에 본문과 동일한 문구를 적어 주세요." };
    }
    const idx = currentBody.indexOf(target);
    if (idx === -1) {
      return {
        ok: false,
        message: "삭제할 문자열을 본문에서 찾지 못했습니다.",
      };
    }
    const next =
      currentBody.slice(0, idx) + currentBody.slice(idx + target.length);
    return { ok: true, body: next.replace(/\n{3,}/g, "\n\n").trimEnd() };
  }

  if (s.startsWith("교체:")) {
    const rest = stripOneLeadingNewline(s.slice("교체:".length)).replace(/^\s+/, "");
    const sep = ">>>";
    const i = rest.indexOf(sep);
    if (i === -1) {
      return {
        ok: false,
        message: `«교체:기존>>>신규» 형식이어야 합니다. (${HELP})`,
      };
    }
    const from = rest.slice(0, i);
    const to = rest.slice(i + sep.length);
    if (!from) {
      return { ok: false, message: "교체 전 문자열은 비울 수 없습니다." };
    }
    const idx = currentBody.indexOf(from);
    if (idx === -1) {
      return {
        ok: false,
        message: "교체할 기존 문구를 본문에서 찾지 못했습니다.",
      };
    }
    const next =
      currentBody.slice(0, idx) + to + currentBody.slice(idx + from.length);
    return { ok: true, body: next };
  }

  return {
    ok: false,
    message: `부분 수정만 가능합니다. ${HELP}`,
  };
}
