"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { DEMO_ARTISTS } from "@/lib/demo-data";
import ArtistCard from "@/components/ArtistCard";
import StatusBadge from "@/components/StatusBadge";

export default function BrowsePage() {
  const categories = useMemo(
    () => ["전체", ...Array.from(new Set(DEMO_ARTISTS.map((a) => a.mainCategory)))],
    [],
  );
  const [cat, setCat] = useState("전체");
  const list = cat === "전체" ? DEMO_ARTISTS : DEMO_ARTISTS.filter((a) => a.mainCategory === cat);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">예술인 둘러보기</h1>
            <StatusBadge status="live" />
          </div>
          <p className="mt-1 text-[var(--muted)]">가입 없이 예술인을 탐색하고 섭외 문의를 보낼 수 있습니다.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/company/search" className="inline-flex items-center gap-1.5 rounded-lg border bg-[var(--surface)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--surface-2)]">
            <Sparkles size={15} className="text-[var(--accent)]" /> 자연어 AI 검색
            <StatusBadge status="demo" className="ml-1" />
          </Link>
          <Link href="/company/pool" className="inline-flex items-center rounded-lg border bg-[var(--surface)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--surface-2)]">
            인재풀
          </Link>
          <Link href="/company/compare" className="inline-flex items-center rounded-lg border bg-[var(--surface)] px-4 py-2 text-sm font-medium transition hover:bg-[var(--surface-2)]">
            후보 비교
          </Link>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              cat === c ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]" : "hover:bg-[var(--surface-2)]"
            }`}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => <ArtistCard key={a.slug} artist={a} />)}
      </div>
    </div>
  );
}
