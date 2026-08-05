import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Users, Clock, Star, MessageSquare } from "lucide-react";
import { DEMO_ARTISTS, getDemoArtist } from "@/lib/demo-data";
import Cover from "@/components/Cover";
import ShareButton from "@/components/ShareButton";
import { DemoDataBadge } from "@/components/StatusBadge";

export function generateStaticParams() {
  return DEMO_ARTISTS.map((a) => ({ slug: a.slug }));
}

export default async function ArtistProfilePage({ params }: PageProps<"/a/[slug]">) {
  const { slug } = await params;
  const artist = getDemoArtist(slug);
  if (!artist) notFound();

  const featured = artist.careers.filter((c) => c.isFeatured);

  return (
    <div className="pb-16">
      {/* 대표 이미지 */}
      <div className="relative">
        <Cover preset={artist.coverImage} className="h-52 w-full md:h-72" rounded="rounded-none" />
        {artist.isDemo && <DemoDataBadge className="absolute right-4 top-4" />}
      </div>

      <div className="mx-auto max-w-4xl px-4">
        {/* 헤더 */}
        <div className="-mt-10 rounded-2xl border bg-[var(--surface)] p-6 shadow-sm">
          <span className="rounded-md bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
            {artist.mainCategory}
          </span>
          <h1 className="mt-2 text-2xl font-bold md:text-3xl">{artist.artistName}</h1>
          <p className="mt-2 text-[var(--muted)]">{artist.introShort}</p>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--muted)]">
            <span className="inline-flex items-center gap-1"><MapPin size={15} /> {artist.mainRegion} · {artist.availableRegions.join(", ")}</span>
            <span className="inline-flex items-center gap-1"><Users size={15} /> {artist.profileType} {artist.teamSize}인</span>
            <span className="inline-flex items-center gap-1"><Clock size={15} /> 공연 가능 ~{artist.durationMin}분</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link href={`/a/${artist.slug}/inquiry`}
              className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold">
              <MessageSquare size={15} /> 섭외 문의하기
            </Link>
            <ShareButton label="프로필 공유" />
          </div>
        </div>

        {/* 핵심 강점 */}
        <Section title="핵심 강점">
          <div className="flex flex-wrap gap-2">
            {artist.strengths.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface-2)] px-3 py-1.5 text-sm">
                <Star size={14} className="text-[var(--accent)]" /> {s}
              </span>
            ))}
          </div>
        </Section>

        {/* 소개 */}
        <Section title="소개">
          <p className="whitespace-pre-line leading-relaxed text-[var(--foreground)]/90">{artist.introLong}</p>
        </Section>

        {/* 대표 영상 */}
        {artist.media.filter((m) => m.type === "youtube").length > 0 && (
          <Section title="대표 영상">
            <div className="grid gap-4 sm:grid-cols-2">
              {artist.media.filter((m) => m.type === "youtube").map((m) => (
                <div key={m.youtubeId} className="overflow-hidden rounded-xl border">
                  <div className="aspect-video">
                    <iframe
                      className="h-full w-full"
                      src={`https://www.youtube.com/embed/${m.youtubeId}`}
                      title={m.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="p-2 text-sm text-[var(--muted)]">{m.title}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 대표 경력 */}
        <Section title="대표 경력">
          <ul className="space-y-2">
            {featured.map((c, i) => (
              <li key={i} className="card flex items-start justify-between gap-3 p-3">
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-sm text-[var(--muted)]">{c.organization}{c.role ? ` · ${c.role}` : ""}</p>
                </div>
                <span className="whitespace-nowrap text-sm text-[var(--muted)]">{c.activityDate}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 전체 경력 */}
        <Section title="전체 경력">
          <ul className="divide-y rounded-xl border">
            {artist.careers.map((c, i) => (
              <li key={i} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <span>{c.title} <span className="text-[var(--muted)]">· {c.organization}</span></span>
                <span className="whitespace-nowrap text-[var(--muted)]">{c.activityDate}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 하단 문의 CTA */}
        <div className="mt-10 card flex flex-col items-center gap-3 bg-gradient-to-br from-[var(--accent-soft)] to-[var(--surface)] p-6 text-center">
          <p className="font-semibold">이 팀을 섭외하고 싶으신가요?</p>
          <p className="text-sm text-[var(--muted)]">가입 없이 문의를 남기면 담당자가 확인 후 회신합니다.</p>
          <Link href={`/a/${artist.slug}/inquiry`} className="btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold">
            섭외 문의하기
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}
