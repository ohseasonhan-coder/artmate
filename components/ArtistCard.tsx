import Link from "next/link";
import { MapPin, Users, Clock } from "lucide-react";
import type { ArtistProfile } from "@/lib/types";
import Cover from "./Cover";
import { DemoDataBadge } from "./StatusBadge";

export default function ArtistCard({ artist }: { artist: ArtistProfile }) {
  return (
    <Link href={`/a/${artist.slug}`} className="card group overflow-hidden transition hover:border-[var(--accent)]/40 hover:shadow-md">
      <div className="relative">
        <Cover preset={artist.coverImage} label={artist.artistName} className="h-40 w-full" rounded="rounded-none" />
        {artist.isDemo && <DemoDataBadge className="absolute left-2 top-2" />}
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded-md bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
            {artist.mainCategory}
          </span>
        </div>
        <h3 className="font-semibold">{artist.artistName}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{artist.introShort}</p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
          <span className="inline-flex items-center gap-1"><MapPin size={13} /> {artist.mainRegion}</span>
          <span className="inline-flex items-center gap-1"><Users size={13} /> {artist.profileType} {artist.teamSize}인</span>
          <span className="inline-flex items-center gap-1"><Clock size={13} /> ~{artist.durationMin}분</span>
        </div>
      </div>
    </Link>
  );
}
