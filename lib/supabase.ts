import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./config";

let client: SupabaseClient | null = null;

/**
 * Supabase 클라이언트를 반환한다.
 * 환경변수가 없으면 null을 반환하고, 호출부는 데모 모드로 폴백한다.
 * (환경변수 부재로 화면 전체가 중단되지 않게 한다.)
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return client;
}
