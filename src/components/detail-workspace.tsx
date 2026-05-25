"use client";

import { useEffect, useRef, useState } from "react";
import { DetailPreview } from "@/src/components/detail-preview";
import { ProductInputForm } from "@/src/components/product-input-form";
import { SectionListPanel } from "@/src/components/section-list-panel";
import {
  clearSectionCopyCache,
  createSectionCacheKey,
  debugSectionCache,
  getCachedSectionCopy,
  saveCachedSectionCopy,
} from "@/src/lib/cache";
import { makeSections } from "@/src/lib/make-sections";
import {
  clearProjectDraft,
  loadProjectDraft,
  saveProjectDraft,
} from "@/src/lib/project-storage";
import {
  clearUsageStats,
  loadUsageStats,
  recordCacheHit,
  recordCacheMiss,
  type UsageStats,
} from "@/src/lib/usage-tracker";
import type {
  DetailSection,
  GeneratedSectionCopy,
  GenerationMode,
  ProductInfo,
} from "@/src/types";

const FALLBACK_PROJECT_NAME = "새 프로젝트";
const FALLBACK_CLIENT_NAME = "클라이언트 미지정";
const DEFAULT_CLIENT_GENERATION_MODE: GenerationMode = "dummy";

const initialUsageStats: UsageStats = {
  totalGenerations: 0,
  cacheHits: 0,
  cacheMisses: 0,
  estimatedSavedRequests: 0,
  lastGeneratedAt: null,
};

const initialProduct: ProductInfo = {
  projectName: "신제품 상세페이지 초안",
  clientName: "개인 외주 클라이언트",
  brandName: "온하루",
  productName: "웜핏 발열 패딩 베스트",
  category: "겨울 의류 / 생활 방한용품",
  targetAudience: "출퇴근과 야외 활동이 잦고 가볍지만 따뜻한 방한 아이템을 찾는 30~50대 고객",
  tone: "clear",
  usp: "가벼운 착용감, 분리형 발열 패드, 생활 방수 원단, 쉬운 세탁 관리",
  specs: "겉감: 폴리에스터 100%\n충전재: 경량 패딩\n사이즈: S, M, L, XL\n색상: 블랙, 차콜",
  forbiddenPhrases: "최고, 1위, 완치, 무조건, 과장된 효능 표현",
  notes: "의료기기가 아니며 체온 유지 보조 목적의 제품으로 표현한다.",
};

export function DetailWorkspace() {
  const pendingGenerationKeysRef = useRef<Set<string>>(new Set());
  const [product, setProduct] = useState<ProductInfo>(initialProduct);
  const [sections, setSections] = useState<DetailSection[]>(() =>
    makeSections(initialProduct),
  );
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [generationMode, setGenerationMode] = useState<GenerationMode>(
    DEFAULT_CLIENT_GENERATION_MODE,
  );
  const [isGenerationModeReady, setIsGenerationModeReady] = useState(false);
  const [storageMessage, setStorageMessage] = useState(
    "저장된 작업을 확인하는 중입니다.",
  );
  const [usageStats, setUsageStats] = useState<UsageStats>(initialUsageStats);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const draft = loadProjectDraft();
      setUsageStats(loadUsageStats());

      if (draft) {
        setProduct(draft.product);
        setSections(draft.sections);
        setLastSavedAt(draft.updatedAt);
        setStorageMessage("마지막 저장본을 불러왔습니다.");
      } else {
        setStorageMessage("아직 저장된 작업이 없습니다.");
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadGenerationMode = async () => {
      try {
        const response = await fetch("/api/ai-config");

        if (!response.ok) {
          return;
        }

        const config = (await response.json()) as Partial<{
          generationMode: GenerationMode;
        }>;

        if (
          isActive &&
          (config.generationMode === "dummy" || config.generationMode === "openai")
        ) {
          setGenerationMode(config.generationMode);
        }
      } catch {
        // Keep the local dummy default if the runtime config route is unavailable.
      } finally {
        if (isActive) {
          setIsGenerationModeReady(true);
        }
      }
    };

    void loadGenerationMode();

    return () => {
      isActive = false;
    };
  }, []);

  const handleProductChange = (nextProduct: ProductInfo) => {
    setProduct(nextProduct);
    setSections(makeSections(nextProduct));
    setStorageMessage("저장되지 않은 변경사항이 있습니다.");
  };

  const handleSectionCopyChange = (
    sectionId: DetailSection["id"],
    copy: string,
  ) => {
    setSections((currentSections) =>
      currentSections.map((section) =>
        section.id === sectionId ? { ...section, copy } : section,
      ),
    );
    setStorageMessage("저장되지 않은 섹션 수정이 있습니다.");
  };

  const handleSectionRegenerate = async (sectionId: DetailSection["id"]) => {
    const targetSection = sections.find((section) => section.id === sectionId);

    if (!targetSection) {
      return;
    }

    if (!isGenerationModeReady) {
      setStorageMessage("Generation mode is still loading. Please try again shortly.");
      return;
    }

    const cacheKey = createSectionCacheKey({
      product,
      sectionKind: targetSection.kind,
      tone: product.tone,
      generationType: generationMode,
    });
    const cachedCopy = getCachedSectionCopy(cacheKey);

    debugSectionCache({
      cacheKey,
      sectionKind: targetSection.kind,
      generationType: generationMode,
      hit: !!cachedCopy,
    });

    if (cachedCopy) {
      setUsageStats(recordCacheHit(cachedCopy.createdAt));
      setSections((currentSections) =>
        currentSections.map((section) =>
          section.id === sectionId
            ? { ...section, copy: cachedCopy.content }
            : section,
        ),
      );
      setStorageMessage(
        `캐시 재사용: ${cachedCopy.source}, generatedAt ${cachedCopy.createdAt}`,
      );
      return;
    }

    if (pendingGenerationKeysRef.current.has(cacheKey)) {
      setStorageMessage("같은 입력의 섹션 생성 요청이 이미 진행 중입니다.");
      return;
    }

    pendingGenerationKeysRef.current.add(cacheKey);
    setStorageMessage("Generating section via /api/generate-section...");

    let generatedSection: GeneratedSectionCopy;
    let apiCached = false;

    try {
      const response = await fetch("/api/generate-section", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sectionKind: targetSection.kind,
          product,
          tone: product.tone,
          generationMode,
        }),
      });

      if (!response.ok) {
        throw new Error(`Generate section request failed: ${response.status}`);
      }

      const responseBody = (await response.json()) as Partial<
        GeneratedSectionCopy & { cached?: boolean }
      >;

      if (
        typeof responseBody.content !== "string" ||
        responseBody.sectionKind !== targetSection.kind ||
        (responseBody.source !== "dummy" && responseBody.source !== "openai") ||
        typeof responseBody.generatedAt !== "string"
      ) {
        throw new Error("Generate section response is invalid.");
      }

      generatedSection = {
        content: responseBody.content,
        sectionKind: responseBody.sectionKind,
        source: responseBody.source,
        generatedAt: responseBody.generatedAt,
      };
      apiCached = responseBody.cached === true;
    } catch {
      setStorageMessage("Section generation failed. No cache entry was written.");
      return;
    } finally {
      pendingGenerationKeysRef.current.delete(cacheKey);
    }

    debugSectionCache({
      cacheKey,
      sectionKind: generatedSection.sectionKind,
      generationType: generationMode,
      hit: false,
    });

    const saved = saveCachedSectionCopy({
      key: cacheKey,
      sectionKind: generatedSection.sectionKind,
      content: generatedSection.content,
      createdAt: generatedSection.generatedAt,
      source: generatedSection.source,
    });

    setSections((currentSections) =>
      currentSections.map((section) =>
        section.id === sectionId
          ? { ...section, copy: generatedSection.content }
          : section,
      ),
    );
    setUsageStats(recordCacheMiss(generatedSection.generatedAt));
    setStorageMessage(
      saved
        ? `API generated: ${generatedSection.source}, cached ${apiCached}, generatedAt ${generatedSection.generatedAt}`
        : `API generated: ${generatedSection.source}, cached ${apiCached}, generatedAt ${generatedSection.generatedAt} (cache save failed)`,
    );
  };

  const handleClearUsage = () => {
    const confirmed = window.confirm(
      "오늘의 생성 사용량 기록을 초기화할까요? 이 작업은 되돌릴 수 없습니다.",
    );

    if (!confirmed) {
      return;
    }

    setUsageStats(clearUsageStats());
    setStorageMessage("사용량 기록을 초기화했습니다.");
  };

  const handleSave = () => {
    const draft = saveProjectDraft({ product, sections });

    if (draft) {
      setLastSavedAt(draft.updatedAt);
      setStorageMessage("저장되었습니다.");
    } else {
      setStorageMessage("브라우저 저장소를 사용할 수 없습니다.");
    }
  };

  const handleLoad = () => {
    const draft = loadProjectDraft();

    if (!draft) {
      setStorageMessage("불러올 저장본이 없습니다.");
      return;
    }

    setProduct(draft.product);
    setSections(draft.sections);
    setLastSavedAt(draft.updatedAt);
    setStorageMessage("저장본을 불러왔습니다.");
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "저장된 프로젝트와 현재 입력값을 초기화할까요? 이 작업은 되돌릴 수 없습니다.",
    );

    if (!confirmed) {
      return;
    }

    clearProjectDraft();
    setProduct(initialProduct);
    setSections(makeSections(initialProduct));
    setLastSavedAt(null);
    setStorageMessage("작업을 초기화했습니다.");
  };

  const handleClearCache = () => {
    const cleared = clearSectionCopyCache();

    setStorageMessage(
      cleared
        ? "더미 섹션 생성 캐시를 초기화했습니다."
        : "브라우저 캐시 저장소를 사용할 수 없습니다.",
    );
  };

  const formattedLastSavedAt = lastSavedAt
    ? new Intl.DateTimeFormat("ko-KR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(lastSavedAt))
    : "저장 전";
  const currentProjectName = product.projectName.trim() || FALLBACK_PROJECT_NAME;
  const currentClientName = product.clientName.trim() || FALLBACK_CLIENT_NAME;
  const formattedLastGeneratedAt = usageStats.lastGeneratedAt
    ? new Intl.DateTimeFormat("ko-KR", {
        timeStyle: "short",
      }).format(new Date(usageStats.lastGeneratedAt))
    : "없음";

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-zinc-500">개인 외주용 MVP</p>
            <h1 className="text-xl font-semibold tracking-tight">
              상세페이지 제작기
            </h1>
            <p className="text-sm text-zinc-500">
              현재 단계는 API 호출 없이 입력값과 더미 카피만으로 섹션 미리보기를
              조립합니다.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 font-medium text-zinc-800">
                {currentProjectName}
              </span>
              <span className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-zinc-600">
                {currentClientName}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 lg:min-w-80">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="rounded-md bg-zinc-900 px-3 py-2 font-medium text-white transition hover:bg-zinc-700"
                onClick={handleSave}
              >
                저장
              </button>
              <button
                type="button"
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100"
                onClick={handleLoad}
              >
                불러오기
              </button>
              <button
                type="button"
                className="rounded-md border border-red-200 bg-white px-3 py-2 font-medium text-red-700 transition hover:border-red-300 hover:bg-red-50"
                onClick={handleReset}
              >
                초기화
              </button>
              <button
                type="button"
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100"
                onClick={handleClearCache}
              >
                캐시 초기화
              </button>
            </div>
            <div className="leading-5">
              <p>마지막 저장: {formattedLastSavedAt}</p>
              <p>{storageMessage}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-5 lg:grid-cols-[420px_minmax(0,1fr)]">
        <aside className="grid min-w-0 content-start gap-5">
          <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">사용량</h2>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  더미 생성 흐름과 캐시 재사용을 오늘 기준으로 추적합니다.
                </p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100"
                onClick={handleClearUsage}
              >
                초기화
              </button>
            </div>
            <dl className="grid grid-cols-2 gap-3">
              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                <dt className="text-xs text-zinc-500">오늘 생성 횟수</dt>
                <dd className="mt-1 text-lg font-semibold text-zinc-950">
                  {usageStats.totalGenerations}
                </dd>
              </div>
              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                <dt className="text-xs text-zinc-500">캐시 재사용 횟수</dt>
                <dd className="mt-1 text-lg font-semibold text-zinc-950">
                  {usageStats.cacheHits}
                </dd>
              </div>
              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                <dt className="text-xs text-zinc-500">절약된 예상 요청 수</dt>
                <dd className="mt-1 text-lg font-semibold text-zinc-950">
                  {usageStats.estimatedSavedRequests}
                </dd>
              </div>
              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                <dt className="text-xs text-zinc-500">마지막 생성 시간</dt>
                <dd className="mt-1 text-sm font-semibold text-zinc-950">
                  {formattedLastGeneratedAt}
                </dd>
              </div>
            </dl>
          </section>
          <ProductInputForm value={product} onChange={handleProductChange} />
        </aside>

        <section className="grid min-w-0 gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <SectionListPanel sections={sections} />
          <DetailPreview
            product={product}
            sections={sections}
            onSectionCopyChange={handleSectionCopyChange}
            onSectionRegenerate={handleSectionRegenerate}
          />
        </section>
      </div>
    </main>
  );
}
