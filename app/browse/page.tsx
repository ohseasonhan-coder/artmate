import { getArtists } from "@/lib/data/artists-server";
import BrowseFilter from "@/components/BrowseFilter";

export const metadata = { title: "예술인 둘러보기 · 아트메이트 AI" };
export const dynamic = "force-dynamic"; // 최신 공개 프로필 반영

export default async function BrowsePage() {
  const artists = await getArtists();
  return <BrowseFilter artists={artists} />;
}
