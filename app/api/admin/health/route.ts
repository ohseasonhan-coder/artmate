import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE, verifySession, isAdminUsersCustom, isAdminSecretCustom,
} from "@/lib/admin-auth";
import {
  getServerAnon, getServiceClient, isServerSupabaseConfigured, hasServiceRole,
} from "@/lib/supabase-server";
import {
  isAiConfigured, preferredModel, isPreferredRetired, generateWithModel, GeminiError,
} from "@/lib/ai";

export const dynamic = "force-dynamic";

const TABLES = [
  "artist_profiles", "career_items", "media_items", "inquiries", "schedules",
  "activity_projects", "checklist_items", "notifications", "feature_interests",
  "user_feedback", "site_config", "users",
];

interface TableCheck { ok: boolean; count?: number | null; error?: string }

/**
 * 관리자 전용 시스템 점검.
 * 환경변수는 "설정 여부(boolean)"만 반환하며 값은 절대 반환하지 않는다.
 * ?ai=1 이면 Gemini에 짧은 테스트 호출을 수행한다(무료 할당량 소량 사용).
 */
export async function GET(req: Request) {
  const store = await cookies();
  if (!verifySession(store.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 401 });
  }
  const testAi = new URL(req.url).searchParams.get("ai") === "1";

  const env = {
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRole: hasServiceRole,
    gemini: isAiConfigured,
    geminiModel: preferredModel, // 모델 이름은 비밀이 아님
    geminiModelRetired: isPreferredRetired,
    adminUsersCustom: isAdminUsersCustom,
    adminSecretCustom: isAdminSecretCustom,
  };

  // ── Supabase ──
  let supabase: Record<string, unknown> = { skipped: true };
  if (isServerSupabaseConfigured) {
    // 서비스 롤이 있으면 RLS 무관 정확한 집계, 없으면 익명(공개 테이블만 정확)
    const sb = getServiceClient() ?? getServerAnon()!;
    const tables: Record<string, TableCheck> = {};
    await Promise.all(
      TABLES.map(async (t) => {
        const { count, error } = await sb.from(t).select("*", { count: "exact", head: true });
        tables[t] = error ? { ok: false, error: error.message } : { ok: true, count };
      }),
    );

    // 최신 스키마 컬럼 확인 (구버전 SQL로 만든 경우 누락)
    const col = await sb.from("artist_profiles").select("duration_min, cover_image").limit(1);
    const schemaUpToDate = !col.error;

    // 시드(공개 프로필 수)
    const pub = await sb.from("artist_profiles").select("*", { count: "exact", head: true }).eq("is_public", true);
    const publicProfiles = pub.error ? null : pub.count;

    // Storage 버킷 (서비스 롤 필요)
    let bucket: Record<string, unknown> = { skipped: true, reason: "서비스 롤 키 필요" };
    const svc = getServiceClient();
    if (svc) {
      const { data, error } = await svc.storage.getBucket("assets");
      bucket = error ? { ok: false, error: error.message } : { ok: true, public: data?.public ?? false };
    }

    // 사이트 설정 저장 여부
    const cfg = await sb.from("site_config").select("updated_at").eq("id", "home").maybeSingle();
    const siteConfigSaved = !cfg.error && !!cfg.data;

    supabase = {
      skipped: false,
      reachable: Object.values(tables).some((t) => t.ok),
      usingServiceRole: !!getServiceClient(),
      tables, schemaUpToDate, publicProfiles, bucket, siteConfigSaved,
    };
  }

  // ── Gemini ──
  let ai: Record<string, unknown> = { skipped: true };
  if (isAiConfigured && testAi) {
    const started = Date.now();
    try {
      const { text, model } = await generateWithModel(
        "너는 연결 테스트 응답기다. 한국어로 아주 짧게 답한다.",
        "연결 확인. '연결 성공'이라고만 답해줘.",
        { maxTokens: 512 },
      );
      ai = { skipped: false, ok: true, model, latencyMs: Date.now() - started, sample: text.slice(0, 60) };
    } catch (e) {
      ai = {
        skipped: false, ok: false, latencyMs: Date.now() - started,
        keyProblem: e instanceof GeminiError ? e.keyProblem : false,
        error: e instanceof Error ? e.message.slice(0, 900) : "알 수 없는 오류",
      };
    }
  }

  return NextResponse.json({
    env,
    supabase,
    ai,
    runtime: { vercelEnv: process.env.VERCEL_ENV ?? null, nodeEnv: process.env.NODE_ENV },
    checkedAt: new Date().toISOString(),
  });
}
