"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Eye } from "lucide-react";
import { getDemoArtist } from "@/lib/demo-data";
import StatusBadge from "@/components/StatusBadge";

const base = getDemoArtist("crossover-ensemble")!;

export default function ProfileEditPage() {
  const [form, setForm] = useState({
    artistName: base.artistName,
    introShort: base.introShort,
    introLong: base.introLong,
    mainRegion: base.mainRegion,
    teamSize: String(base.teamSize),
    durationMin: String(base.durationMin),
    youtube: `https://youtu.be/${base.media[0]?.youtubeId ?? ""}`,
  });
  const [saved, setSaved] = useState(false);
  function set(k: keyof typeof form, v: string) { setForm((f) => ({ ...f, [k]: v })); setSaved(false); }

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">프로필 편집</h1>
          <StatusBadge status="live" />
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/profile/ai" className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3 py-1.5 text-sm font-medium text-[var(--accent)]">
            <Sparkles size={15} /> AI로 자동 생성 <StatusBadge status="demo" className="ml-1" />
          </Link>
          <Link href={`/a/${base.slug}`} className="inline-flex items-center gap-1.5 rounded-lg border bg-[var(--surface)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--surface-2)]">
            <Eye size={15} /> 공개 프로필 미리보기
          </Link>
        </div>
      </div>

      <div className="mt-6 card space-y-4 p-5">
        <F label="활동명"><input className="i" value={form.artistName} onChange={(e) => set("artistName", e.target.value)} /></F>
        <F label="한 문장 소개"><input className="i" value={form.introShort} onChange={(e) => set("introShort", e.target.value)} /></F>
        <F label="상세 소개"><textarea rows={5} className="i" value={form.introLong} onChange={(e) => set("introLong", e.target.value)} /></F>
        <div className="grid gap-4 sm:grid-cols-3">
          <F label="활동 지역"><input className="i" value={form.mainRegion} onChange={(e) => set("mainRegion", e.target.value)} /></F>
          <F label="팀 인원"><input className="i" type="number" value={form.teamSize} onChange={(e) => set("teamSize", e.target.value)} /></F>
          <F label="공연 가능시간(분)"><input className="i" type="number" value={form.durationMin} onChange={(e) => set("durationMin", e.target.value)} /></F>
        </div>
        <F label="YouTube 링크"><input className="i" value={form.youtube} onChange={(e) => set("youtube", e.target.value)} placeholder="https://youtu.be/..." /></F>

        <div className="flex items-center gap-3 border-t pt-4">
          <button onClick={() => setSaved(true)} className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold">저장</button>
          {saved && <span className="text-sm text-[var(--live)]">저장되었습니다.</span>}
        </div>
      </div>

      <style>{`.i{width:100%;border:1px solid var(--border);background:var(--surface);border-radius:.5rem;padding:.55rem .75rem;font-size:.875rem;outline:none}.i:focus{border-color:var(--accent)}`}</style>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-medium">{label}</span>{children}</label>;
}
