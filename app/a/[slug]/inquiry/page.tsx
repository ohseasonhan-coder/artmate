import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getArtist } from "@/lib/data/artists-server";
import InquiryForm from "@/components/InquiryForm";

export const dynamic = "force-dynamic";

export default async function InquiryPage({ params }: PageProps<"/a/[slug]/inquiry">) {
  const { slug } = await params;
  const artist = await getArtist(slug);
  if (!artist) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href={`/a/${slug}`} className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
        <ChevronLeft size={16} /> {artist.artistName} 프로필로
      </Link>
      <h1 className="text-2xl font-bold">{artist.artistName} 섭외 문의</h1>
      <p className="mt-2 mb-6 text-[var(--muted)]">
        아래 정보를 남겨주시면 담당자가 확인 후 회신드립니다.
      </p>
      <InquiryForm artistSlug={slug} artistName={artist.artistName} />
    </div>
  );
}
