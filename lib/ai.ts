import "server-only";

// Gemini(무료 등급) 호출 — 키는 서버에서만 사용 (클라이언트 노출 금지)
const KEY = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || "";
const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

export const isAiConfigured = KEY.length > 0;

const ENDPOINT = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`;

/**
 * Gemini로 텍스트 생성. json=true면 JSON 모드로 강제하고 파싱해 반환.
 * 미설정 시 호출 금지(isAiConfigured로 먼저 확인).
 */
export async function generate(
  system: string,
  user: string,
  opts: { json?: boolean; maxTokens?: number } = {},
): Promise<string> {
  if (!isAiConfigured) throw new Error("AI_NOT_CONFIGURED");

  const res = await fetch(ENDPOINT(MODEL), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: opts.maxTokens ?? 1024,
        ...(opts.json ? { responseMimeType: "application/json" } : {}),
      },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`GEMINI_ERROR ${res.status}: ${detail.slice(0, 300)}`);
  }
  const data = await res.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
  return text.trim();
}

export async function generateJson<T>(system: string, user: string, maxTokens = 1024): Promise<T> {
  const raw = await generate(system, user, { json: true, maxTokens });
  // 코드펜스 등 혹시 모를 래핑 제거
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  return JSON.parse(cleaned) as T;
}
