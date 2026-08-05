"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Star } from "lucide-react";
import { getDemoArtist } from "@/lib/demo-data";
import Cover from "@/components/Cover";
import StatusBadge from "@/components/StatusBadge";

const base = getDemoArtist("crossover-ensemble")!;
const PHOTOS = ["indigo", "plum", "amber", "default"];

export default function SelectPage() {
  const [cover, setCover] = useState(0);
  const [featured, setFeatured] = useState<number[]>(
    base.careers.map((c, i) => (c.isFeatured ? i : -1)).filter((i) => i >= 0),
  );

  function toggle(i: number) {
    setFeatured((f) => (f.includes(i) ? f.filter((x) => x !== i) : [...f, i]));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">대표 사진 · 경력 선택</h1>
        <StatusBadge status="live" />
      </div>
      <p className="mt-1 text-[var(--muted)]">공개 프로필 맨 위에 보여줄 대표 사진과, 강조할 대표 경력을 골라주세요.</p>

      {/* 대표 사진 */}
      <h2 className="mt-8 mb-3 font-bold">대표 사진</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PHOTOS.map((p, i) => (
          <button key={p} onClick={() => setCover(i)} className="relative">
            <Cover preset={p} className="aspect-square w-full" />
            {cover === i && (
              <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-fg)]">
                <Check size={14} />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 대표 경력 */}
      <h2 className="mt-8 mb-3 font-bold">대표 경력 <span className="text-sm font-normal text-[var(--muted)]">({featured.length}개 선택됨)</span></h2>
      <ul className="space-y-2">
        {base.careers.map((c, i) => {
          const on = featured.includes(i);
          return (
            <li key={i}>
              <button onClick={() => toggle(i)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition ${on ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "hover:bg-[var(--surface-2)]"}`}>
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-sm text-[var(--muted)]">{c.organization} · {c.activityDate}</p>
                </div>
                <Star size={18} className={on ? "fill-[var(--accent)] text-[var(--accent)]" : "text-[var(--muted)]"} />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex justify-end gap-2">
        <Link href="/onboarding/analyzing" className="rounded-lg border bg-[var(--surface)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--surface-2)]">다시 분석</Link>
        <Link href={`/a/${base.slug}`} className="btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold">공개 프로필 완성 → 미리보기</Link>
      </div>
    </div>
  );
}
