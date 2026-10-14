// Wix형 홈 화면 구성 설정 (블록 기반).
// 프로토타입에서는 localStorage에 저장한다.
// (실서비스에서는 Supabase site_config 테이블 + 관리자 RLS로 대체)

export type BlockType = "hero" | "features" | "flow" | "cta" | "notice" | "text" | "ad";

// 내장 블록(삭제 불가, 순서·표시만 조절) vs 커스텀 블록(추가·삭제 가능)
export const BUILTIN_TYPES: BlockType[] = ["hero", "features", "flow", "cta"];
export const CUSTOM_TYPES: BlockType[] = ["notice", "text", "ad"];

export interface BaseBlock {
  id: string;
  type: BlockType;
  enabled: boolean;
}
export interface NoticeBlock extends BaseBlock {
  type: "notice";
  text: string;
  color: string; // 배경 프리셋
}
export interface TextBlock extends BaseBlock {
  type: "text";
  title: string;
  body: string;
  align: "left" | "center";
}
export interface AdBlock extends BaseBlock {
  type: "ad";
  title: string;
  text: string;
  ctaLabel: string;
  href: string;
  color: string;
}
export type Block = BaseBlock | NoticeBlock | TextBlock | AdBlock;

export interface HeroContent {
  badge: string;
  title: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  tertiaryLabel: string;
  tertiaryHref: string;
}

export interface ThemeConfig {
  accent: string; // hex
}

export interface SiteConfig {
  theme: ThemeConfig;
  hero: HeroContent;
  blocks: Block[];
}

export const BLOCK_LABELS: Record<BlockType, string> = {
  hero: "히어로 (메인 문구·버튼)",
  features: "핵심 기능 카드",
  flow: "핵심 서비스 흐름",
  cta: "하단 CTA",
  notice: "공지 바",
  text: "텍스트 블록",
  ad: "광고 배너",
};

export const COLOR_PRESETS = ["indigo", "plum", "amber", "default"] as const;

export const ACCENT_PRESETS: { name: string; value: string }[] = [
  { name: "인디고", value: "#4f46e5" },
  { name: "바이올렛", value: "#7c3aed" },
  { name: "블루", value: "#2563eb" },
  { name: "에메랄드", value: "#059669" },
  { name: "로즈", value: "#e11d48" },
  { name: "앰버", value: "#d97706" },
];

export const DEFAULT_HERO: HeroContent = {
  badge: "문화예술인 전용 AI 개인 매니저",
  title: "프로필을 만들고, 섭외를 받고, 일정을 관리하세요.",
  subtitle:
    "사진, 영상, 기존 이력서를 한 번만 등록하면 전문 프로필을 만들고 기업의 섭외 문의부터 일정과 경력까지 한곳에서 관리할 수 있습니다.",
  primaryLabel: "무료 프로필 만들기",
  primaryHref: "/onboarding",
  secondaryLabel: "샘플 프로필 보기",
  secondaryHref: "/a/crossover-ensemble",
  tertiaryLabel: "기업으로 둘러보기",
  tertiaryHref: "/browse",
};

export const DEFAULT_CONFIG: SiteConfig = {
  theme: { accent: "#4f46e5" },
  hero: DEFAULT_HERO,
  blocks: [
    { id: "b-hero", type: "hero", enabled: true },
    { id: "b-features", type: "features", enabled: true },
    {
      id: "b-ad-sample", type: "ad", enabled: true,
      title: "🎬 제작 스튜디오 오픈 예정",
      text: "공연 포스터·카드뉴스·영문 프로필을 자동으로. 출시 알림을 받아보세요.",
      ctaLabel: "미리보기", href: "/dashboard/studio", color: "plum",
    } as AdBlock,
    { id: "b-flow", type: "flow", enabled: true },
    { id: "b-cta", type: "cta", enabled: true },
  ],
};

export function newBlock(type: BlockType): Block {
  const id = `b-${type}-${Date.now()}`;
  switch (type) {
    case "notice":
      return { id, type, enabled: true, text: "📢 새 소식을 여기에 입력하세요.", color: "indigo" } as NoticeBlock;
    case "text":
      return { id, type, enabled: true, title: "새 텍스트 블록", body: "내용을 입력하세요.", align: "center" } as TextBlock;
    case "ad":
      return { id, type, enabled: true, title: "새 광고 배너", text: "홍보 문구를 입력하세요.", ctaLabel: "자세히", href: "/features", color: "indigo" } as AdBlock;
    default:
      return { id, type, enabled: true };
  }
}

const LS_KEY = "artmate:site_config";

interface LegacyConfig {
  sections?: { id: string; enabled: boolean }[];
  ads?: (Omit<AdBlock, "type"> & { placement?: string })[];
}

/** 구버전(sections+ads) 설정을 블록 기반으로 이관 */
function migrate(raw: SiteConfig & LegacyConfig): SiteConfig {
  if (raw.blocks?.length) {
    return {
      theme: raw.theme ?? DEFAULT_CONFIG.theme,
      hero: { ...DEFAULT_HERO, ...(raw.hero ?? {}) },
      blocks: raw.blocks,
    };
  }
  const blocks: Block[] = (raw.sections ?? DEFAULT_CONFIG.blocks.filter((b) => BUILTIN_TYPES.includes(b.type)).map((b) => ({ id: b.id, enabled: true })) as unknown as { id: string; enabled: boolean }[])
    .map((s) => ({ id: "b-" + s.id, type: (s.id as BlockType), enabled: s.enabled }));
  for (const ad of raw.ads ?? []) {
    blocks.push({ id: ad.id || `b-ad-${Date.now()}`, type: "ad", enabled: ad.enabled, title: ad.title, text: ad.text, ctaLabel: ad.ctaLabel, href: ad.href, color: ad.color } as AdBlock);
  }
  return { theme: DEFAULT_CONFIG.theme, hero: DEFAULT_HERO, blocks: blocks.length ? blocks : DEFAULT_CONFIG.blocks };
}

export function loadConfig(): SiteConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_CONFIG;
    return migrate(JSON.parse(raw));
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: SiteConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(config));
}
