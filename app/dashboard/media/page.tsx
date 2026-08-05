"use client";

import { useState } from "react";
import { Star, Trash2, Plus, Video } from "lucide-react";
import { getDemoArtist } from "@/lib/demo-data";
import Cover from "@/components/Cover";
import StatusBadge, { DemoDataBadge } from "@/components/StatusBadge";

const base = getDemoArtist("crossover-ensemble")!;

export default function MediaPage() {
  const [photos, setPhotos] = useState(["indigo", "plum", "amber"]);
  const [featured, setFeatured] = useState(0);
  const [videos, setVideos] = useState(base.media.filter((m) => m.type === "youtube"));

  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">사진 · 영상 관리</h1>
        <StatusBadge status="live" />
        <DemoDataBadge className="ml-1" />
      </div>
      <p className="mt-1 text-[var(--muted)]">대표 사진을 지정하고 공연 영상을 관리합니다. 영상은 YouTube 링크로 등록됩니다.</p>

      {/* 사진 */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-bold">사진</h2>
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-[var(--surface-2)]">
          <Plus size={15} /> 사진 추가
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setPhotos((p) => [...p, ["indigo", "plum", "amber", "default"][p.length % 4]]); e.target.value = ""; }} />
        </label>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p, i) => (
          <div key={i} className="group relative">
            <Cover preset={p} className="aspect-square w-full" />
            {featured === i && <span className="absolute left-2 top-2 rounded-md bg-[var(--accent)] px-2 py-0.5 text-[10px] font-medium text-[var(--accent-fg)]">대표</span>}
            <div className="absolute inset-x-2 bottom-2 flex justify-between opacity-0 transition group-hover:opacity-100">
              <button onClick={() => setFeatured(i)} className="grid h-8 w-8 place-items-center rounded-lg bg-black/50 text-white"><Star size={15} /></button>
              <button onClick={() => setPhotos((ps) => ps.filter((_, j) => j !== i))} className="grid h-8 w-8 place-items-center rounded-lg bg-black/50 text-white"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* 영상 */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-bold">YouTube 영상</h2>
      </div>
      <div className="mt-3 space-y-2">
        {videos.map((v, i) => (
          <div key={i} className="card flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <Video size={20} className="text-rose-500" />
              <div>
                <p className="text-sm font-medium">{v.title}</p>
                <p className="text-xs text-[var(--muted)]">youtu.be/{v.youtubeId}</p>
              </div>
            </div>
            <button onClick={() => setVideos((vs) => vs.filter((_, j) => j !== i))} className="text-[var(--muted)] hover:text-rose-500"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
