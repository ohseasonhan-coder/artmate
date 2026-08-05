import type { FeatureStatus } from "./types";

export interface FeatureDef {
  key: string;
  title: string;
  desc: string;
  status: FeatureStatus;
  href?: string;
  group: "프로필·섭외" | "일정·활동" | "AI·자동화" | "연동" | "기업" | "관리";
}

// 서비스 전체 기능 지도 — 상태 배지의 단일 진실 공급원(single source of truth)
export const FEATURES: FeatureDef[] = [
  // 프로필·섭외
  { key: "signup", title: "문화예술인 회원가입", desc: "이메일·활동명·카테고리·활동지역으로 가입", status: "live", href: "/signup", group: "프로필·섭외" },
  { key: "profile-edit", title: "기본 프로필 등록·편집", desc: "소개·경력·사진·YouTube·활동지역 등록", status: "live", href: "/dashboard/profile", group: "프로필·섭외" },
  { key: "public-profile", title: "공개 프로필 & 공유 링크", desc: "대표사진·강점·경력·영상·문의 버튼이 담긴 공개 페이지", status: "live", href: "/browse", group: "프로필·섭외" },
  { key: "ai-profile", title: "AI 프로필 자동 생성", desc: "기존 자료를 분석해 소개문·강점·경력요약을 제안", status: "demo", href: "/dashboard/profile/ai", group: "프로필·섭외" },

  // 일정·활동
  { key: "inquiry", title: "기업 섭외 문의", desc: "기업은 가입 없이 공개 프로필에서 문의 가능", status: "live", href: "/browse", group: "일정·활동" },
  { key: "inquiry-manage", title: "문의 관리", desc: "신규→일정확인→협의→확정→완료 상태 관리", status: "live", href: "/dashboard/inquiries", group: "일정·활동" },
  { key: "schedule", title: "기본 일정관리", desc: "공연·리허설·미팅·마감 일정 관리", status: "live", href: "/dashboard/schedule", group: "일정·활동" },
  { key: "project", title: "활동 프로젝트", desc: "문의 한 건을 프로젝트로 전환, 체크리스트 관리", status: "live", href: "/dashboard/projects", group: "일정·활동" },
  { key: "career-add", title: "공연 후 경력 자동 추가", desc: "활동 완료 시 프로필 경력에 반영", status: "live", href: "/dashboard/projects", group: "일정·활동" },

  // AI·자동화
  { key: "assistant", title: "AI 개인비서", desc: "오늘 일정·답변 필요 문의·준비사항·경력 후보 안내", status: "demo", href: "/dashboard/assistant", group: "AI·자동화" },
  { key: "studio", title: "제작 스튜디오 (PPT·포스터)", desc: "기업행사 PPT·한페이지 프로필·포스터·카드뉴스·영문 프로필", status: "soon", href: "/dashboard/studio", group: "AI·자동화" },
  { key: "passport", title: "예술활동 패스포트", desc: "활동 증빙·자동 경력관리·경력 인증", status: "soon", href: "/dashboard/passport", group: "AI·자동화" },
  { key: "grants", title: "지원사업 AI 비서", desc: "맞춤 지원사업 추천·신청 가능성·신청서 초안", status: "soon", href: "/dashboard/grants", group: "AI·자동화" },
  { key: "contracts", title: "계약·권리·정산", desc: "계약금액·잔금·저작권·초상권·미정산 알림", status: "soon", href: "/dashboard/contracts", group: "AI·자동화" },
  { key: "sns", title: "SNS 홍보 콘텐츠", desc: "공연 전/후 게시물·해시태그·릴스 문구", status: "soon", href: "/dashboard/studio", group: "AI·자동화" },

  // 연동
  { key: "gcal", title: "Google Calendar 연동", desc: "공연·리허설·미팅 일정 양방향 동기화", status: "soon", href: "/dashboard/integrations", group: "연동" },
  { key: "gmail", title: "Gmail 섭외 감지", desc: "섭외 메일 감지·프로젝트 변환·답장 초안", status: "soon", href: "/dashboard/integrations", group: "연동" },
  { key: "gdrive", title: "Google Drive 자료 관리", desc: "행사별 폴더·사진/PDF 자동분류", status: "soon", href: "/dashboard/integrations", group: "연동" },

  // 기업
  { key: "browse", title: "예술인 둘러보기 & 카테고리 검색", desc: "기업이 카테고리로 공연팀 탐색", status: "live", href: "/browse", group: "기업" },
  { key: "ai-search", title: "자연어 AI 검색·매칭", desc: "\"12월 송년회 3~5인 밝은 공연팀\" 같은 자연어 검색", status: "demo", href: "/company/search", group: "기업" },
  { key: "compare", title: "후보 비교·인재풀", desc: "여러 후보를 나란히 비교, 사내 검토보고서", status: "soon", href: "/company/search", group: "기업" },
  { key: "team", title: "팀 일정·역할 관리", desc: "팀원 일정·참여여부·리허설 투표·정산", status: "soon", href: "/dashboard/team", group: "일정·활동" },

  // 관리
  { key: "admin", title: "관리자 콘솔", desc: "프로필 검토·공개 승인·기능 관심도·피드백", status: "demo", href: "/admin", group: "관리" },
];

export const FEATURE_MAP: Record<string, FeatureDef> = Object.fromEntries(
  FEATURES.map((f) => [f.key, f]),
);

export const STATUS_META: Record<
  FeatureStatus,
  { label: string; note?: string }
> = {
  live: { label: "사용 가능" },
  demo: {
    label: "데모",
    note: "현재 데모 데이터로 작동하는 프로토타입 기능입니다.",
  },
  soon: {
    label: "구현 중",
    note: "현재 프로토타입 단계이며 실제 기능은 구현 중입니다.",
  },
};
