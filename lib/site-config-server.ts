import "server-only";
import { getServerAnon } from "./supabase-server";
import { DEFAULT_CONFIG, DEFAULT_HERO, type SiteConfig } from "./site-config";

export const SITE_CONFIG_ID = "home";

function normalize(raw: Partial<SiteConfig> | null | undefined): SiteConfig {
  if (!raw || !raw.blocks?.length) return DEFAULT_CONFIG;
  return {
    theme: raw.theme ?? DEFAULT_CONFIG.theme,
    hero: { ...DEFAULT_HERO, ...(raw.hero ?? {}) },
    blocks: raw.blocks,
  };
}

/**
 * 서버에서 홈 설정을 가져온다.
 * Supabase 연결 시 site_config 테이블에서, 아니면 기본값.
 * (랜딩이 모든 방문자에게 동일한 구성을 보여주기 위함)
 */
export async function getServerConfig(): Promise<{ config: SiteConfig; source: "supabase" | "default" }> {
  const supabase = getServerAnon();
  if (!supabase) return { config: DEFAULT_CONFIG, source: "default" };
  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("data")
      .eq("id", SITE_CONFIG_ID)
      .maybeSingle();
    if (error || !data?.data) return { config: DEFAULT_CONFIG, source: "default" };
    return { config: normalize(data.data as SiteConfig), source: "supabase" };
  } catch {
    return { config: DEFAULT_CONFIG, source: "default" };
  }
}
