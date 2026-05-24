import "server-only";

const DEFAULT_AI_PROVIDER = "openai";
const DEFAULT_AI_GENERATION_MODE = "dummy";

const AI_PROVIDERS = [DEFAULT_AI_PROVIDER] as const;
const AI_GENERATION_MODES = [DEFAULT_AI_GENERATION_MODE, "openai"] as const;

export type AiProvider = (typeof AI_PROVIDERS)[number];
export type AiGenerationMode = (typeof AI_GENERATION_MODES)[number];

export type ServerAiEnv = {
  provider: AiProvider;
  generationMode: AiGenerationMode;
  openaiApiKey: string | null;
  openaiModel: string | null;
  isOpenAiConfigured: boolean;
  isOpenAiGenerationEnabled: boolean;
};

function readOptionalEnv(name: string) {
  const value = process.env[name]?.trim();

  return value ? value : null;
}

function isAiProvider(value: string): value is AiProvider {
  return AI_PROVIDERS.includes(value as AiProvider);
}

function isAiGenerationMode(value: string): value is AiGenerationMode {
  return AI_GENERATION_MODES.includes(value as AiGenerationMode);
}

function readAiProvider() {
  const provider = readOptionalEnv("AI_PROVIDER");

  return provider && isAiProvider(provider) ? provider : DEFAULT_AI_PROVIDER;
}

function readAiGenerationMode() {
  const mode = readOptionalEnv("AI_GENERATION_MODE");

  return mode && isAiGenerationMode(mode) ? mode : DEFAULT_AI_GENERATION_MODE;
}

export function getServerAiEnv(): ServerAiEnv {
  const provider = readAiProvider();
  const generationMode = readAiGenerationMode();
  const openaiApiKey = readOptionalEnv("OPENAI_API_KEY");
  const openaiModel = readOptionalEnv("OPENAI_MODEL");
  const isOpenAiConfigured = provider === "openai" && !!openaiApiKey && !!openaiModel;

  return {
    provider,
    generationMode,
    openaiApiKey,
    openaiModel,
    isOpenAiConfigured,
    isOpenAiGenerationEnabled: generationMode === "openai" && isOpenAiConfigured,
  };
}
