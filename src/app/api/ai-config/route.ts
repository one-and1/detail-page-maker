import { getServerAiEnv } from "@/src/lib/env";

export async function GET() {
  const env = getServerAiEnv();

  return Response.json({
    generationMode: env.generationMode,
    provider: env.provider,
    isOpenAiConfigured: env.isOpenAiConfigured,
  });
}
