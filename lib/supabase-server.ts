import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const isServerSupabaseConfigured = URL.length > 0 && ANON.length > 0;
export const hasServiceRole = URL.length > 0 && SERVICE.length > 0;

/** 공개 읽기용 (RLS 적용). 예: 사이트 설정 읽기 */
export function getServerAnon(): SupabaseClient | null {
  if (!isServerSupabaseConfigured) return null;
  return createClient(URL, ANON, { auth: { persistSession: false } });
}

/**
 * 서비스 롤 클라이언트 (RLS 우회).
 * 관리자 쿠키 검증을 통과한 서버 라우트에서만 사용한다.
 */
export function getServiceClient(): SupabaseClient | null {
  if (!hasServiceRole) return null;
  return createClient(URL, SERVICE, { auth: { persistSession: false } });
}
