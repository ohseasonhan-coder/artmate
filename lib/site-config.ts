// Wix형 홈 화면 구성 설정.
// 프로토타입에서는 localStorage에 저장한다.
// (실서비스에서는 Supabase site_config 테이블 + 관리자 RLS로 대체)

export type SectionId = "hero" | "features" | "flow" | "cta";

export interface Section {
  id: SectionId;
  label: string;
  enabled: boolean;
}

export type AdPlacement = "top" | "after-hero" | "after-features" | "bottom";

export interface AdSlot {
  id: string;
  enabled: boolean;
  placement: AdPlacement;
  title: string;
  text: string;
  ctaLabel: string;
  href: string;
  color: string; // Cover 프리셋 키
}

export interface SiteConfig {
  sections: Section[];
  ads: AdSlot[];
}

export const SECTION_LABELS: Record<SectionId, string> = {
  hero: "히어로 (메인 문구·버튼)",
  features: "핵심 기능 카드",
  flow: "핵심 서비스 흐름",
  cta: "하단 CTA",
};

export const PLACEMENT_LABELS: Record<AdPlacement, string> = {
  top: "상단 (내비 아래)",
  "after-hero": "히어로 다음",
  "after-features": "기능 카드 다음",
  bottom: "맨 아래",
};

export const DEFAULT_CONFIG: SiteConfig = {
  sections: [
    { id: "hero", label: SECTION_LABELS.hero, enabled: true },
    { id: "features", label: SECTION_LABELS.features, enabled: true },
    { id: "flow", label: SECTION_LABELS.flow, enabled: true },
    { id: "cta", label: SECTION_LABELS.cta, enabled: true },
  ],
  ads: [
    {
      id: "ad-sample",
      enabled: true,
      placement: "after-hero",
      title: "🎬 제작 스튜디오 오픈 예정",
      text: "공연 포스터·카드뉴스·영문 프로필을 자동으로. 출시 알림을 받아보세요.",
      ctaLabel: "미리보기",
      href: "/dashboard/studio",
      color: "plum",
    },
  ],
};

const LS_KEY = "artmate:site_config";

export function loadConfig(): SiteConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw) as SiteConfig;
    // 기본 섹션이 누락되지 않도록 병합
    if (!parsed.sections?.length) parsed.sections = DEFAULT_CONFIG.sections;
    if (!parsed.ads) parsed.ads = [];
    return parsed;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: SiteConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(config));
}
