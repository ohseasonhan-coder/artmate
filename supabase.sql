-- ============================================================
--  아트메이트 AI — Supabase 스키마 + Row Level Security
--  Supabase 대시보드 > SQL Editor 에 붙여넣어 실행하세요.
--  (기존 테이블이 있으면 CREATE 문은 건너뛰고 필요한 것만 실행)
-- ============================================================

-- 사용자 프로필(인증은 auth.users 사용, 역할 등 부가정보 저장)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'artist',          -- artist | company | admin
  created_at timestamptz not null default now()
);

-- 문화예술인 프로필
create table if not exists public.artist_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  artist_name text not null,
  profile_type text default '개인',              -- 개인 | 팀
  real_name text,
  main_category text,
  sub_categories text[],
  introduction_short text,
  introduction_long text,
  strengths text[],
  main_region text,
  available_regions text[],
  team_size int default 1,
  duration_min int default 60,                    -- 공연 가능 시간(분)
  cover_image text default 'default',             -- 대표 이미지 프리셋/URL
  profile_status text default 'draft',           -- draft | review | public
  public_slug text unique,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- 기존 배포 호환용(이미 테이블이 있는 경우)
alter table public.artist_profiles add column if not exists duration_min int default 60;
alter table public.artist_profiles add column if not exists cover_image text default 'default';

create table if not exists public.career_items (
  id uuid primary key default gen_random_uuid(),
  artist_profile_id uuid references public.artist_profiles(id) on delete cascade,
  title text,
  organization text,
  role text,
  activity_date date,
  description text,
  verification_status text default 'unverified',
  is_featured boolean default false,
  is_public boolean default true,
  source_type text default 'manual',
  created_at timestamptz not null default now()
);

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  artist_profile_id uuid references public.artist_profiles(id) on delete cascade,
  media_type text,                               -- photo | youtube | pdf
  file_url text,
  youtube_url text,
  title text,
  is_featured boolean default false,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

-- 기업 문의 (기업은 무가입 → 익명 INSERT 허용)
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  artist_profile_id uuid references public.artist_profiles(id) on delete set null,
  artist_slug text,                              -- public_slug 로도 연결 가능
  company_name text,
  contact_name text,
  contact_email text,
  contact_phone text,
  event_name text,
  event_date date,
  event_time text,
  location text,
  audience_size text,
  performance_duration text,
  estimated_budget text,
  request_details text,
  status text not null default '신규 문의',
  created_at timestamptz not null default now()
);

create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  artist_profile_id uuid references public.artist_profiles(id) on delete cascade,
  inquiry_id uuid references public.inquiries(id) on delete set null,
  title text,
  schedule_type text,
  start_at timestamptz,
  end_at timestamptz,
  location text,
  visibility text default 'private',             -- private | availability | public
  status text default '임시',
  memo text,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_projects (
  id uuid primary key default gen_random_uuid(),
  artist_profile_id uuid references public.artist_profiles(id) on delete cascade,
  inquiry_id uuid references public.inquiries(id) on delete set null,
  schedule_id uuid references public.schedules(id) on delete set null,
  project_name text,
  company_name text,
  event_date date,
  location text,
  status text default '준비 중',
  request_details text,
  internal_memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  activity_project_id uuid references public.activity_projects(id) on delete cascade,
  title text,
  is_completed boolean default false,
  due_date date,
  sort_order int default 0
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  notification_type text,
  title text,
  message text,
  is_read boolean default false,
  created_at timestamptz not null default now()
);

-- 기능 관심도 (비로그인 익명 등록 허용)
create table if not exists public.feature_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  feature_key text not null,
  interest_type text,
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  page_key text,
  rating int,
  comment text,
  created_at timestamptz not null default now()
);

-- ============================================================
--  Row Level Security
-- ============================================================
alter table public.users enable row level security;
alter table public.artist_profiles enable row level security;
alter table public.career_items enable row level security;
alter table public.media_items enable row level security;
alter table public.inquiries enable row level security;
alter table public.schedules enable row level security;
alter table public.activity_projects enable row level security;
alter table public.checklist_items enable row level security;
alter table public.notifications enable row level security;
alter table public.feature_interests enable row level security;
alter table public.user_feedback enable row level security;

-- users: 본인만 읽기/수정
create policy "users self read"  on public.users for select using (auth.uid() = id);
create policy "users self write" on public.users for all    using (auth.uid() = id) with check (auth.uid() = id);

-- artist_profiles: 공개 프로필은 누구나 읽기, 소유자는 전체 관리
create policy "profiles public read" on public.artist_profiles for select using (is_public = true or auth.uid() = user_id);
create policy "profiles owner write" on public.artist_profiles for all    using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- career_items / media_items: 공개 프로필의 공개 항목은 읽기, 소유자는 관리
create policy "career public read" on public.career_items for select using (
  is_public = true or exists (select 1 from public.artist_profiles p where p.id = artist_profile_id and p.user_id = auth.uid())
);
create policy "career owner write" on public.career_items for all using (
  exists (select 1 from public.artist_profiles p where p.id = artist_profile_id and p.user_id = auth.uid())
) with check (
  exists (select 1 from public.artist_profiles p where p.id = artist_profile_id and p.user_id = auth.uid())
);

create policy "media public read" on public.media_items for select using (
  exists (select 1 from public.artist_profiles p where p.id = artist_profile_id and (p.is_public = true or p.user_id = auth.uid()))
);
create policy "media owner write" on public.media_items for all using (
  exists (select 1 from public.artist_profiles p where p.id = artist_profile_id and p.user_id = auth.uid())
) with check (
  exists (select 1 from public.artist_profiles p where p.id = artist_profile_id and p.user_id = auth.uid())
);

-- inquiries: 누구나(익명 포함) 문의 등록 가능, 해당 예술인만 조회/수정
create policy "inquiry anon insert" on public.inquiries for insert with check (true);
create policy "inquiry owner read"  on public.inquiries for select using (
  exists (select 1 from public.artist_profiles p
          where (p.id = artist_profile_id or p.public_slug = artist_slug) and p.user_id = auth.uid())
);
create policy "inquiry owner update" on public.inquiries for update using (
  exists (select 1 from public.artist_profiles p
          where (p.id = artist_profile_id or p.public_slug = artist_slug) and p.user_id = auth.uid())
);

-- schedules / activity_projects / checklist / notifications: 소유자 전용
create policy "schedule owner" on public.schedules for all using (
  exists (select 1 from public.artist_profiles p where p.id = artist_profile_id and p.user_id = auth.uid())
) with check (
  exists (select 1 from public.artist_profiles p where p.id = artist_profile_id and p.user_id = auth.uid())
);
create policy "project owner" on public.activity_projects for all using (
  exists (select 1 from public.artist_profiles p where p.id = artist_profile_id and p.user_id = auth.uid())
) with check (
  exists (select 1 from public.artist_profiles p where p.id = artist_profile_id and p.user_id = auth.uid())
);
create policy "checklist owner" on public.checklist_items for all using (
  exists (select 1 from public.activity_projects ap join public.artist_profiles p on p.id = ap.artist_profile_id
          where ap.id = activity_project_id and p.user_id = auth.uid())
) with check (
  exists (select 1 from public.activity_projects ap join public.artist_profiles p on p.id = ap.artist_profile_id
          where ap.id = activity_project_id and p.user_id = auth.uid())
);
create policy "notif owner" on public.notifications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- feature_interests / user_feedback: 익명 포함 누구나 등록 가능
create policy "interest insert" on public.feature_interests for insert with check (true);
create policy "interest self read" on public.feature_interests for select using (auth.uid() = user_id);
create policy "feedback insert" on public.user_feedback for insert with check (true);
create policy "feedback self read" on public.user_feedback for select using (auth.uid() = user_id);

-- ============================================================
--  사이트 설정 (Wix형 페이지 빌더) — 단일 행(id='home')에 JSON 저장
-- ============================================================
create table if not exists public.site_config (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_config enable row level security;
-- 홈 구성은 누구나 읽기, 쓰기는 서비스 롤(관리자 API)로만 (일반 write 정책 없음 → anon 차단)
create policy "site_config public read" on public.site_config for select using (true);

-- ============================================================
--  Storage: 빌더 이미지 업로드용 공개 버킷 'assets'
-- ============================================================
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do nothing;
-- 공개 읽기 (업로드는 서비스 롤 API가 RLS를 우회해 처리)
create policy "assets public read" on storage.objects for select using (bucket_id = 'assets');
