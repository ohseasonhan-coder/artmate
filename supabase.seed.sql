-- ============================================================
--  아트메이트 AI — 시드 데이터 (공개 예술인 3팀)
--  supabase.sql 실행 후, Supabase SQL Editor에서 실행하세요.
--  여러 번 실행해도 안전하도록 재삽입 전 기존 항목을 정리합니다.
-- ============================================================

-- 프로필 (user_id는 비워 둠 = 데모/시드용 공개 프로필)
insert into public.artist_profiles
  (artist_name, profile_type, main_category, sub_categories, introduction_short, introduction_long,
   strengths, main_region, available_regions, team_size, duration_min, cover_image, profile_status, public_slug, is_public)
values
  ('루미에르 크로스오버 앙상블', '팀', '크로스오버 앙상블',
   array['클래식','팝페라','기업행사'],
   '클래식의 품격과 팝의 대중성을 잇는 4인 크로스오버 앙상블',
   '바이올린·첼로·피아노·보컬로 구성된 4인 앙상블입니다. 기업 창립기념 행사, 시상식, 지역축제 무대에서 대중적인 크로스오버 레퍼토리를 선보입니다. 행사 성격에 맞춘 선곡과 20~60분 유연한 구성이 강점입니다.',
   array['기업행사 특화 선곡','20~60분 유연한 구성','전국 출장 가능'],
   '서울', array['수도권','전국'], 4, 60, 'indigo', 'public', 'crossover-ensemble', true),
  ('미드나잇 재즈 트리오', '팀', '재즈 밴드',
   array['재즈','호텔 라운지','기업행사'],
   '호텔 라운지와 기업행사를 위한 세련된 3인 재즈 트리오',
   '피아노·베이스·드럼 3인 편성으로 호텔 라운지, 기업 리셉션, 연말 송년회에 어울리는 스탠다드 재즈와 보사노바를 연주합니다. 배경음악부터 메인 공연까지 20~60분 구성이 가능합니다.',
   array['세련된 라운지 무드','리셉션 배경음악 특화','호텔·기업행사 경험 다수'],
   '서울', array['수도권'], 3, 60, 'plum', 'public', 'jazz-trio', true),
  ('원더 매직 퍼포먼스', '팀', '마술 퍼포먼스',
   array['마술','가족행사','공공기관'],
   '어린이·가족행사에 활기를 더하는 1~2인 마술 퍼포먼스팀',
   '1~2인 구성으로 어린이날 행사, 가족 축제, 공공기관 시민행사에서 관객 참여형 마술과 코믹 퍼포먼스를 선보입니다. 무대·거리 공연 모두 가능하며 연령대별 구성이 강점입니다.',
   array['관객 참여형 구성','무대·거리공연 모두 가능','공공기관 행사 경험'],
   '인천', array['수도권','전국'], 2, 40, 'amber', 'public', 'magic-performance', true)
on conflict (public_slug) do nothing;

-- 재삽입 전 기존 경력/미디어 정리 (중복 방지)
delete from public.career_items where artist_profile_id in
  (select id from public.artist_profiles where public_slug in ('crossover-ensemble','jazz-trio','magic-performance'));
delete from public.media_items where artist_profile_id in
  (select id from public.artist_profiles where public_slug in ('crossover-ensemble','jazz-trio','magic-performance'));

-- 경력
insert into public.career_items (artist_profile_id, title, organization, role, activity_date, is_featured, is_public)
select id, v.title, v.org, v.role, v.d::date, v.feat, true
from public.artist_profiles p
join (values
  ('crossover-ensemble','삼성 계열사 창립기념식 축하공연','대기업 A','메인 공연','2025-11-01', true),
  ('crossover-ensemble','성남시 가을문화축제 초청공연','성남문화재단',null,'2025-10-01', true),
  ('crossover-ensemble','그랜드호텔 갈라디너 라이브','그랜드호텔',null,'2025-09-01', true),
  ('crossover-ensemble','금융사 VIP 세미나 오프닝','증권사 B',null,'2025-06-01', false),
  ('crossover-ensemble','대학교 개교기념 음악회','C대학교',null,'2025-05-01', false),
  ('jazz-trio','호텔 연말 갈라 라이브','시티호텔','라운지 세션','2025-12-01', true),
  ('jazz-trio','IT기업 송년회 공연','테크사 D',null,'2025-12-01', true),
  ('jazz-trio','브랜드 론칭 리셉션','패션브랜드 E',null,'2025-08-01', false),
  ('magic-performance','구청 어린이날 큰잔치','인천 F구청','메인 퍼포먼스','2025-05-01', true),
  ('magic-performance','복합쇼핑몰 가족페스티벌','쇼핑몰 G',null,'2025-07-01', true),
  ('magic-performance','도서관 여름방학 특별공연','H시립도서관',null,'2025-08-01', false)
) as v(slug, title, org, role, d, feat) on p.public_slug = v.slug;

-- 미디어 (YouTube)
insert into public.media_items (artist_profile_id, media_type, youtube_url, title, is_featured, sort_order)
select id, 'youtube', v.url, v.title, true, v.ord
from public.artist_profiles p
join (values
  ('crossover-ensemble','https://youtu.be/dQw4w9WgXcQ','기업행사 하이라이트', 0),
  ('crossover-ensemble','https://youtu.be/9bZkp7q19f0','축제 무대 실황', 1),
  ('jazz-trio','https://youtu.be/kXYiU_JCYtU','라운지 세션 스케치', 0),
  ('magic-performance','https://youtu.be/L_jWHffIx5E','가족행사 공연 영상', 0)
) as v(slug, url, title, ord) on p.public_slug = v.slug;
