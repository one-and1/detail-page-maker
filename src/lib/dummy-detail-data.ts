import type { DetailSectionDraft, ProductContextForm } from "@/src/types/detail-page";

/** 로컬·데모 전용 더미 입력 (API 미연동) */
export const DUMMY_PRODUCT_CONTEXT: ProductContextForm = {
  projectName: "2026 상반기 디테일 페이지",
  clientName: "주식회사 산들바람",
  brandName: "산들 WIND",
  category: "히든 붙임 히팅 패딩 자켓",
  productName: "WIND-HEAT Pro (남여 공용)",
  targetAudience:
    "40~60대 라이더·등산층보다 출퇴근·일상방한에 민감한 성인층까지 한겨울 보온·활동성 균형이 필요할 때 고려하는 사람",
  tone: "minimal",
  forbiddenPhrases: "최고, 1등, 무조건 환불 불가 같은 표현 금지",
  usp: [
    "붙임식 히팅 패드 3영역 분산(가슴·등·허리)으로 착용감 무게 중심을 맞춤",
    "USB-C 패우치 분리 가능 / 세탁 시 분리 세탁으로 유지관리 간단",
    "발수 코팅 + 경량 패딩으로 비오는 도심 통행에 활용 가능",
    "네오프렌 허리 밴드로 라이딩 자세에서 들뜸 완화(체형 의존도 낮춤 설정)",
  ].join("\n"),
  specs: [
    "외피: 나일론 100% (발수)",
    "충전재: 폴리에스터 패딩",
    "히팅: DC 5V / USB-C 패드 (제조사 패치버전 따라 상이할 수 있음)",
    "사이즈: S~2XL",
    "세탁: 패드 분리 후 약하게 단독 손세탁 권장",
  ].join("\n"),
  legalNotes:
    "의료기기 아님. 체온 유지 보조 목적 표현 유지. KC·전파 인증번호는 실제 판매 시 반드시 교체 표기.",
};

export const DUMMY_SECTIONS: DetailSectionDraft[] = [
  {
    id: "sec-hero",
    kind: "hero",
    label: "히어로",
    body: `${DUMMY_PRODUCT_CONTEXT.brandName} — 겨울 도심·라이딩을 위한 분리형 패드 히팅 패딩\n\n포인트 카피: ${DUMMY_PRODUCT_CONTEXT.productName}\n내 몸 라인에 맞춰 패드 분리까지. 무게 부담을 줄인 일상방한 패딩.`,
    reviseDraft: "",
  },
  {
    id: "sec-spec",
    kind: "spec",
    label: "핵심 스펙",
    body: `[제품 특징]\n• 패드 분리 가능 → 세탁·보관 간편\n• 3축 히팅 영역 분산 배치\n• 경량 패딩 + 발수 처리\n• 활동량에 맞춘 레이어링용 기본 레이어로 설계`,
    reviseDraft: "",
  },
  {
    id: "sec-compare",
    kind: "compare",
    label: "비포·비교",
    body: `[기존 방한 패딩]\n두껍지만 활동 시 답답, 세탁 시 관리 까다로움\n\n[WIND-HEAT 방식]\n필요한 자리만 선택적으로 온열·분리 세탁으로 유지관리 부담을 낮춤`,
    reviseDraft: "",
  },
  {
    id: "sec-faq",
    kind: "faq",
    label: "FAQ",
    body: `Q. 세탁은 어떻게 하나요?\nA. 히팅 패드를 분리한 뒤 약하게 손세탁을 권장합니다.\n\nQ. 라이더에게 맞나요?\nA. 허리 밴드 형태와 분산 패드 포지션을 도심·라이딩 병행 활동형에 맞춰 설계했습니다.`,
    reviseDraft: "",
  },
  {
    id: "sec-cta",
    kind: "cta",
    label: "구매/문의 안내",
    body: `[구매 안내]\n카테고리: ${DUMMY_PRODUCT_CONTEXT.category}\n사이즈 가이드는 상품 이미지 탭 또는 별도 자료 참고 바랍니다.\n교환·반품은 전자상거래법 범위 내 운영정책을 따릅니다.`,
    reviseDraft: "",
  },
];
