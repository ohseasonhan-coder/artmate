"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2, AlertTriangle, XCircle, MinusCircle, RefreshCw, Bot, Database, Shield, Server, Loader2,
} from "lucide-react";

type Status = "ok" | "warn" | "fail" | "skip";
interface Item { label: string; status: Status; detail?: string; fix?: string }
interface Group { title: string; icon: React.ElementType; items: Item[] }

/* eslint-disable @typescript-eslint/no-explicit-any */
function buildGroups(d: any): Group[] {
  const env = d.env;
  const sb = d.supabase;
  const ai = d.ai;
  const redeploy = "Vercel → Settings → Environment Variables에 추가한 뒤 반드시 Redeploy 하세요.";

  const envItems: Item[] = [
    { label: "NEXT_PUBLIC_SUPABASE_URL", status: env.supabaseUrl ? "ok" : "fail",
      fix: env.supabaseUrl ? undefined : `Supabase → Settings → API의 Project URL. ${redeploy} (NEXT_PUBLIC_ 값은 빌드 시점에 반영)` },
    { label: "NEXT_PUBLIC_SUPABASE_ANON_KEY", status: env.supabaseAnon ? "ok" : "fail",
      fix: env.supabaseAnon ? undefined : `Supabase → Settings → API의 anon public 키. ${redeploy}` },
    { label: "SUPABASE_SERVICE_ROLE_KEY", status: env.serviceRole ? "ok" : "fail",
      detail: env.serviceRole ? "빌더 전체 공유 저장·이미지 업로드 가능" : "없으면 빌더 저장이 이 브라우저에만 되고 이미지 업로드 불가",
      fix: env.serviceRole ? undefined : `Supabase → Settings → API의 service_role 키(Sensitive로 저장). ${redeploy}` },
    { label: "GEMINI_API_KEY", status: env.gemini ? "ok" : "fail",
      detail: env.gemini ? undefined : "없으면 AI 기능이 데모 응답으로 동작",
      fix: env.gemini ? undefined : `aistudio.google.com → Get API key. ${redeploy}` },
    {
      label: "GEMINI_MODEL",
      status: env.geminiModelRetired ? "warn" : "ok",
      detail: env.geminiModelRetired
        ? `"${env.geminiModel}"은(는) 퇴역한 모델입니다. 현재는 자동으로 건너뛰고 최신 모델을 사용합니다.`
        : env.geminiModel ? `지정: ${env.geminiModel} (실패 시 자동 대체)` : "미지정 → 자동 선택(gemini-3.8-flash 우선)",
      fix: env.geminiModelRetired ? "Vercel에서 GEMINI_MODEL 값을 지우거나 gemini-3.8-flash로 바꾸세요." : undefined,
    },
  ];

  const supItems: Item[] = [];
  if (sb.skipped) {
    supItems.push({ label: "Supabase 연결", status: "skip", detail: "URL/anon 키가 없어 점검을 건너뜀 (사이트는 데모 데이터로 동작)" });
  } else {
    const tables = Object.entries(sb.tables as Record<string, any>);
    const missing = tables.filter(([, t]) => !t.ok).map(([n]) => n);
    supItems.push({
      label: "Supabase 접속", status: sb.reachable ? "ok" : "fail",
      detail: sb.reachable ? (sb.usingServiceRole ? "서비스 롤로 점검(정확한 집계)" : "익명 키로 점검(비공개 테이블 건수는 0으로 보일 수 있음)") : "응답 없음",
      fix: sb.reachable ? undefined : "URL·anon 키 값이 정확한지, Supabase 프로젝트가 일시정지 상태가 아닌지 확인하세요.",
    });
    supItems.push({
      label: `테이블 (${tables.length - missing.length}/${tables.length})`,
      status: missing.length ? "fail" : "ok",
      detail: missing.length ? `없음: ${missing.join(", ")}` : undefined,
      fix: missing.length ? "Supabase → SQL Editor에서 supabase.sql 전체를 실행하세요." : undefined,
    });
    supItems.push({
      label: "스키마 최신 여부", status: sb.schemaUpToDate ? "ok" : "warn",
      fix: sb.schemaUpToDate ? undefined : "artist_profiles에 duration_min/cover_image 컬럼이 없습니다. supabase.sql을 다시 실행하세요(안전).",
    });
    supItems.push({
      label: "공개 예술인 데이터", status: sb.publicProfiles > 0 ? "ok" : "warn",
      detail: sb.publicProfiles == null ? "확인 불가" : `${sb.publicProfiles}팀 공개 중`,
      fix: sb.publicProfiles > 0 ? undefined : "supabase.seed.sql을 실행하면 샘플 3팀이 등록됩니다. (없으면 둘러보기가 빈 화면)",
    });
    const b = sb.bucket;
    supItems.push({
      label: "Storage 'assets' 버킷",
      status: b.skipped ? "skip" : b.ok && b.public ? "ok" : b.ok ? "warn" : "fail",
      detail: b.skipped ? b.reason : b.ok ? (b.public ? "공개 버킷" : "비공개 버킷 — 이미지가 보이지 않음") : b.error,
      fix: b.skipped ? undefined : !b.ok ? "supabase.sql 하단의 Storage 부분을 실행하세요." : !b.public ? "Storage → assets → 설정에서 Public으로 변경하세요." : undefined,
    });
    supItems.push({
      label: "홈 구성 공유 저장", status: sb.siteConfigSaved ? "ok" : "warn",
      detail: sb.siteConfigSaved ? "모든 방문자에게 동일한 홈 구성" : "아직 저장된 구성이 없음(기본 홈 표시)",
      fix: sb.siteConfigSaved ? undefined : "페이지 빌더에서 한 번 '저장'하면 전체 공유가 시작됩니다.",
    });
  }

  const aiItems: Item[] = [];
  if (!env.gemini) {
    aiItems.push({ label: "Gemini 호출", status: "skip", detail: "키 없음 — 데모 응답으로 동작" });
  } else if (ai.skipped) {
    aiItems.push({ label: "Gemini 호출", status: "skip", detail: "위의 'AI 연결 테스트' 버튼으로 실제 호출을 확인하세요." });
  } else if (ai.ok) {
    aiItems.push({ label: "Gemini 호출", status: "ok", detail: `${ai.model} · ${ai.latencyMs}ms · 응답: "${ai.sample}"` });
  } else {
    const quota = /429|RESOURCE_EXHAUSTED|quota/i.test(ai.error ?? "");
    aiItems.push({
      label: "Gemini 호출", status: "fail", detail: ai.error,
      fix: ai.keyProblem
        ? "API 키가 유효하지 않습니다. AI Studio에서 키를 다시 복사(앞뒤 공백 주의)해 넣고 Redeploy 하세요."
        : quota
          ? "무료 할당량 초과입니다. aistudio.google.com/rate-limit 에서 한도를 확인하고 잠시 후 다시 시도하세요."
          : "모든 후보 모델이 실패했습니다. 오류 내용을 저에게 알려주시면 원인을 잡아드립니다.",
    });
  }

  const secItems: Item[] = [
    { label: "관리자 계정", status: env.adminUsersCustom ? "ok" : "warn",
      detail: env.adminUsersCustom ? "사용자 지정 계정 사용 중" : "기본 계정(master/season, master1/J) 사용 중 — 누구나 추측 가능",
      fix: env.adminUsersCustom ? undefined : `ADMIN_USERS="아이디:강한비번,아이디2:강한비번" 설정. ${redeploy}` },
    { label: "세션 서명 키", status: env.adminSecretCustom ? "ok" : "warn",
      detail: env.adminSecretCustom ? "사용자 지정 시크릿 사용 중" : "기본 시크릿 사용 중 — 관리자 세션 위조 위험",
      fix: env.adminSecretCustom ? undefined : `ADMIN_SECRET에 32자 이상 랜덤 문자열 설정. ${redeploy}` },
  ];

  return [
    { title: "환경변수", icon: Server, items: envItems },
    { title: "Supabase (데이터·저장소)", icon: Database, items: supItems },
    { title: "AI (Gemini)", icon: Bot, items: aiItems },
    { title: "관리자 보안", icon: Shield, items: secItems },
  ];
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const ICON: Record<Status, { Icon: React.ElementType; cls: string }> = {
  ok: { Icon: CheckCircle2, cls: "text-[var(--live)]" },
  warn: { Icon: AlertTriangle, cls: "text-[var(--demo)]" },
  fail: { Icon: XCircle, cls: "text-rose-500" },
  skip: { Icon: MinusCircle, cls: "text-[var(--muted)]" },
};

export default function StatusPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiTesting, setAiTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (withAi = false) => {
    withAi ? setAiTesting(true) : setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/health${withAi ? "?ai=1" : ""}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "점검 실패");
    } finally {
      setLoading(false);
      setAiTesting(false);
    }
  }, []);

  useEffect(() => { load(false); }, [load]);

  const groups = data ? buildGroups(data) : [];
  const all = groups.flatMap((g) => g.items);
  const fails = all.filter((i) => i.status === "fail").length;
  const warns = all.filter((i) => i.status === "warn").length;
  const runtime = (data?.runtime as { vercelEnv: string | null } | undefined)?.vercelEnv;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">시스템 점검</h1>
          <p className="mt-1 text-[var(--muted)]">
            정식 운영에 필요한 설정이 제대로 되었는지 확인합니다. 키 값은 표시하지 않고 설정 여부만 보여줍니다.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => load(true)} disabled={aiTesting || loading}
            className="inline-flex items-center gap-1.5 rounded-lg border bg-[var(--surface)] px-3 py-2 text-sm font-medium hover:bg-[var(--surface-2)] disabled:opacity-60">
            {aiTesting ? <Loader2 size={15} className="animate-spin" /> : <Bot size={15} />} AI 연결 테스트
          </button>
          <button onClick={() => load(false)} disabled={loading || aiTesting}
            className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-60">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> 다시 점검
          </button>
        </div>
      </div>

      {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-950 dark:text-rose-300">점검 실패: {error}</p>}

      {data && (
        <>
          <div className={`mt-6 rounded-xl border p-4 ${fails ? "border-rose-300 bg-rose-50 dark:bg-rose-950/40" : warns ? "border-[var(--demo)]/30 bg-[var(--demo-soft)]" : "border-[var(--live)]/30 bg-[var(--live-soft)]"}`}>
            <p className="font-semibold">
              {fails ? `해결이 필요한 항목 ${fails}개` : warns ? "핵심 설정 완료 · 권장 조치 남음" : "정식 운영 준비 완료 ✅"}
              {warns > 0 && fails > 0 && ` · 권장 조치 ${warns}개`}
            </p>
            <p className="mt-0.5 text-sm text-[var(--muted)]">
              실행 환경: {runtime === "production" ? "운영(Production)" : runtime === "preview" ? "미리보기(Preview)" : "로컬 개발"}
              {" · "}점검 시각: {new Date(data.checkedAt as string).toLocaleString("ko-KR")}
            </p>
          </div>

          <div className="mt-6 space-y-6">
            {groups.map((g) => {
              const GIcon = g.icon;
              return (
                <section key={g.title}>
                  <h2 className="mb-2 flex items-center gap-1.5 font-bold"><GIcon size={16} /> {g.title}</h2>
                  <div className="card divide-y">
                    {g.items.map((it) => {
                      const { Icon, cls } = ICON[it.status];
                      return (
                        <div key={it.label} className="flex gap-3 p-3">
                          <Icon size={18} className={`mt-0.5 shrink-0 ${cls}`} />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{it.label}</p>
                            {it.detail && <p className="mt-0.5 whitespace-pre-wrap break-words text-xs text-[var(--muted)]">{it.detail}</p>}
                            {it.fix && <p className="mt-1 text-xs font-medium text-[var(--accent)]">→ {it.fix}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}

      {!data && !error && (
        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-[var(--muted)]">
          <Loader2 size={16} className="animate-spin" /> 점검 중…
        </div>
      )}
    </div>
  );
}
