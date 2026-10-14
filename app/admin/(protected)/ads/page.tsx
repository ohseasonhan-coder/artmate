"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Trash2, Megaphone } from "lucide-react";
import { DEFAULT_CONFIG, loadConfig, saveConfig, type SiteConfig, type AdBlock } from "@/lib/site-config";
import StatusBadge from "@/components/StatusBadge";

export default function AdsPage() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  useEffect(() => setConfig(loadConfig()), []);

  const ads = config.blocks.filter((b): b is AdBlock => b.type === "ad");

  function toggle(id: string, enabled: boolean) {
    const next = { ...config, blocks: config.blocks.map((b) => (b.id === id ? { ...b, enabled } : b)) };
    setConfig(next); saveConfig(next);
  }
  function remove(id: string) {
    const next = { ...config, blocks: config.blocks.filter((b) => b.id !== id) };
    setConfig(next); saveConfig(next);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">광고 관리</h1>
            <StatusBadge status="demo" />
          </div>
          <p className="mt-1 text-[var(--muted)]">홈 화면에 노출되는 광고·프로모션 배너를 관리합니다.</p>
        </div>
        <Link href="/admin/builder" className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold">
          <Megaphone size={15} /> 빌더에서 배너 편집
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {ads.length === 0 && (
          <p className="card p-6 text-center text-sm text-[var(--muted)]">등록된 광고 배너가 없습니다. 빌더에서 추가하세요.</p>
        )}
        {ads.map((ad) => (
          <div key={ad.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-semibold">{ad.title}</p>
              <p className="truncate text-sm text-[var(--muted)]">{ad.text}</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-[var(--accent)]">
                <ExternalLink size={12} /> {ad.href}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm">
                <input type="checkbox" checked={ad.enabled} onChange={(e) => toggle(ad.id, e.target.checked)} />
                노출
              </label>
              <button onClick={() => remove(ad.id)} className="text-[var(--muted)] hover:text-rose-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
