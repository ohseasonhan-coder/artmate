import "server-only";

// Gemini 호출 — 키는 서버에서만 사용 (클라이언트 노출 금지)
const KEY = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || "";
const PREFERRED = process.env.GEMINI_MODEL?.trim() || "";

// 무료 등급 Flash 계열 후보 (앞에서부터 시도). 2026-10 기준 공식 모델 목록 반영.
const FALLBACKS = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-2.5-flash"];

// 퇴역(호출 불가) 모델 — GEMINI_MODEL에 들어 있어도 건너뜀
export const RETIRED_MODELS = [
  "gemini-2.0-flash", "gemini-2.0-flash-001", "gemini-2.0-flash-lite",
  "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro",
];

export const isAiConfigured = KEY.length > 0;
export const preferredModel = PREFERRED || null;
export const isPreferredRetired = !!PREFERRED && RETIRED_MODELS.includes(PREFERRED);

export function modelCandidates(): string[] {
  const head = PREFERRED && !isPreferredRetired ? [PREFERRED] : [];
  return [...new Set([...(workingModel ? [workingModel] : []), ...head, ...FALLBACKS])];
}

// 마지막으로 성공한 모델 (서버 인스턴스 동안 재사용)
let workingModel: string | null = null;
export function getWorkingModel() {
  return workingModel;
}

export class GeminiError extends Error {
  constructor(public status: number, message: string, public keyProblem = false) {
    super(message);
  }
}

interface GenOpts {
  json?: boolean;
  maxTokens?: number;
}

async function callModel(model: string, system: string, user: string, opts: GenOpts): Promise<string> {
  const generationConfig: Record<string, unknown> = {
    temperature: 0.7,
    maxOutputTokens: opts.maxTokens ?? 4096, // 생각 토큰 포함 한도이므로 넉넉히
  };
  if (opts.json) generationConfig.responseMimeType = "application/json";
  // Gemini 3 계열은 기본 생각 수준이 높아 응답이 느리고 한도를 소모 → low로 제한
  if (model.startsWith("gemini-3")) generationConfig.thinkingConfig = { thinkingLevel: "low" };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig,
      }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const keyProblem =
      res.status === 401 || res.status === 403 ||
      /API key not valid|API_KEY_INVALID|PERMISSION_DENIED/i.test(detail);
    throw new GeminiError(res.status, `${model} → HTTP ${res.status}: ${detail.slice(0, 240)}`, keyProblem);
  }

  const data = await res.json();
  const parts: { text?: string; thought?: boolean }[] = data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts.filter((p) => !p.thought).map((p) => p.text ?? "").join("").trim();
  if (!text) {
    const reason = data?.candidates?.[0]?.finishReason ?? data?.promptFeedback?.blockReason ?? "unknown";
    throw new GeminiError(502, `${model} → 빈 응답 (사유: ${reason})`);
  }
  return text;
}

/** 후보 모델을 순서대로 시도. 키 문제면 즉시 중단. */
export async function generateWithModel(
  system: string,
  user: string,
  opts: GenOpts = {},
): Promise<{ text: string; model: string }> {
  if (!isAiConfigured) throw new GeminiError(0, "AI_NOT_CONFIGURED");
  const errors: string[] = [];
  for (const model of modelCandidates()) {
    try {
      const text = await callModel(model, system, user, opts);
      workingModel = model;
      return { text, model };
    } catch (e) {
      if (e instanceof GeminiError && e.keyProblem) throw e; // 다른 모델로 바꿔도 해결 안 됨
      errors.push(e instanceof Error ? e.message : String(e));
      if (workingModel === model) workingModel = null;
    }
  }
  throw new GeminiError(503, `모든 후보 모델 실패:\n${errors.join("\n")}`);
}

export async function generate(system: string, user: string, opts: GenOpts = {}): Promise<string> {
  return (await generateWithModel(system, user, opts)).text;
}

export async function generateJson<T>(system: string, user: string, maxTokens = 4096): Promise<T> {
  const raw = await generate(system, user, { json: true, maxTokens });
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(cleaned) as T;
}
