// 아트메이트 AI — 공용 타입

export type FeatureStatus = "live" | "demo" | "soon";

export interface ArtistProfile {
  slug: string;
  artistName: string;
  profileType: "개인" | "팀";
  mainCategory: string;
  subCategories: string[];
  introShort: string;
  introLong: string;
  strengths: string[];
  mainRegion: string;
  availableRegions: string[];
  teamSize: number;
  durationMin: number; // 공연 가능 시간(분)
  coverImage: string; // 그라디언트 프리셋 키
  careers: CareerItem[];
  media: MediaItem[];
  isDemo?: boolean;
}

export interface CareerItem {
  title: string;
  organization: string;
  role?: string;
  activityDate: string; // YYYY-MM
  isFeatured?: boolean;
}

export interface MediaItem {
  type: "youtube" | "photo";
  youtubeId?: string;
  title: string;
}

export type InquiryStatus =
  | "신규 문의"
  | "일정 확인"
  | "협의 중"
  | "확정"
  | "완료"
  | "취소";

export interface Inquiry {
  id: string;
  artistSlug: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  eventName: string;
  eventDate: string;
  location: string;
  audienceSize?: string;
  performanceDuration?: string;
  estimatedBudget?: string;
  requestDetails: string;
  status: InquiryStatus;
  createdAt: string;
  isDemo?: boolean;
}

export type ScheduleType =
  | "공연"
  | "리허설"
  | "기업 미팅"
  | "개인 일정"
  | "임시 섭외"
  | "확정 섭외"
  | "제출 마감";

export interface ScheduleItem {
  id: string;
  title: string;
  type: ScheduleType;
  date: string; // YYYY-MM-DD
  location?: string;
  status: "임시" | "확정" | "완료";
}
