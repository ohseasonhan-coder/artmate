// 환경 설정 감지 — Supabase/AI 미연결 시에도 데모 모드로 안전하게 동작

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Supabase 환경변수가 모두 채워졌는지 여부 */
export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;

/** 데모 모드: 외부 연결이 없으면 샘플 데이터로 화면이 열림 */
export const isDemoMode = !isSupabaseConfigured;
