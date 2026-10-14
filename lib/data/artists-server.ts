import "server-only";
import { getServerAnon } from "@/lib/supabase-server";
import { isServerSupabaseConfigured } from "@/lib/supabase-server";
import { DEMO_ARTISTS, getDemoArtist } from "@/lib/demo-data";
import { parseYoutubeId } from "@/lib/site-config";
import type { ArtistProfile, CareerItem, MediaItem } from "@/lib/types";

const SELECT = "*, career_items(*), media_items(*)";

interface CareerRow {
  title: string; organization: string; role: string | null;
  activity_date: string | null; is_featured: boolean | null; is_public: boolean | null;
}
interface MediaRow {
  media_type: string; youtube_url: string | null; file_url: string | null;
  title: string | null; is_featured: boolean | null; sort_order: number | null;
}
interface ProfileRow {
  public_slug: string; artist_name: string; profile_type: string | null;
  main_category: string | null; sub_categories: string[] | null;
  introduction_short: string | null; introduction_long: string | null;
  strengths: string[] | null; main_region: string | null; available_regions: string[] | null;
  team_size: number | null; duration_min: number | null; cover_image: string | null;
  career_items: CareerRow[] | null; media_items: MediaRow[] | null;
}

function mapRow(row: ProfileRow): ArtistProfile {
  const careers: CareerItem[] = (row.career_items ?? [])
    .filter((c) => c.is_public !== false)
    .map((c) => ({
      title: c.title, organization: c.organization, role: c.role ?? undefined,
      activityDate: (c.activity_date ?? "").slice(0, 7),
      isFeatured: !!c.is_featured,
    }))
    .sort((a, b) => b.activityDate.localeCompare(a.activityDate));

  const media: MediaItem[] = (row.media_items ?? [])
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((m) => ({
      type: m.media_type === "youtube" ? "youtube" : "photo",
      youtubeId: m.youtube_url ? parseYoutubeId(m.youtube_url) : undefined,
      title: m.title ?? "",
    }));

  return {
    slug: row.public_slug,
    artistName: row.artist_name,
    profileType: row.profile_type === "팀" ? "팀" : "개인",
    mainCategory: row.main_category ?? "",
    subCategories: row.sub_categories ?? [],
    introShort: row.introduction_short ?? "",
    introLong: row.introduction_long ?? "",
    strengths: row.strengths ?? [],
    mainRegion: row.main_region ?? "",
    availableRegions: row.available_regions ?? [],
    teamSize: row.team_size ?? 1,
    durationMin: row.duration_min ?? 60,
    coverImage: row.cover_image ?? "default",
    careers,
    media,
  };
}

/** 공개 예술인 목록. Supabase 미연결 시 데모 데이터로 폴백. */
export async function getArtists(): Promise<ArtistProfile[]> {
  if (!isServerSupabaseConfigured) return DEMO_ARTISTS;
  const sb = getServerAnon()!;
  const { data, error } = await sb
    .from("artist_profiles")
    .select(SELECT)
    .eq("is_public", true)
    .order("created_at", { ascending: false });
  if (error) return DEMO_ARTISTS; // 쿼리 실패 시에도 빈 화면 대신 폴백
  return (data as ProfileRow[]).map(mapRow); // 연결 후 비어있으면 [] 반환(실제 상태 반영)
}

/** slug로 공개 프로필 조회. 미연결 시 데모, 연결 후 없으면 undefined. */
export async function getArtist(slug: string): Promise<ArtistProfile | undefined> {
  if (!isServerSupabaseConfigured) return getDemoArtist(slug);
  const sb = getServerAnon()!;
  const { data, error } = await sb
    .from("artist_profiles")
    .select(SELECT)
    .eq("public_slug", slug)
    .eq("is_public", true)
    .maybeSingle();
  if (error || !data) return undefined;
  return mapRow(data as ProfileRow);
}
