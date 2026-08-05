"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp, ArrowDown, Eye, EyeOff, Plus, Trash2, ExternalLink, Save, RotateCcw } from "lucide-react";
import {
  DEFAULT_CONFIG, loadConfig, saveConfig, PLACEMENT_LABELS,
  type SiteConfig, type AdSlot, type AdPlacement,
} from "@/lib/site-config";
import StatusBadge from "@/components/StatusBadge";

const COLORS = ["indigo", "plum", "amber", "default"];

export default function BuilderPage() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);
  useEffect(() => setConfig(loadConfig()), []);

  function update(next: SiteConfig) { setConfig(next); setSaved(false); }
  function persist() { saveConfig(config); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  function reset() { update(structuredClone(DEFAULT_CONFIG)); }

  function moveSection(i: number, dir: -1 | 1) {
    const arr = [...config.sections];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    update({ ...config, sections: arr });
  }
  function toggleSection(i: number) {
    const arr = config.sections.map((s, k) => (k === i ? { ...s, enabled: !s.enabled } : s));
    update({ ...config, sections: arr });
  }

  function addAd() {
    const ad: AdSlot = {
      id: "ad-" + Date.now(), enabled: true, placement: "after-hero",
      title: "새 광고 배너", text: "홍보 문구를 입력하세요.", ctaLabel: "자세히", href: "/features", color: "indigo",
    };
    update({ ...config, ads: [...config.ads, ad] });
  }
  function updateAd(id: string, patch: Partial<AdSlot>) {
    update({ ...config, ads: config.ads.map((a) => (a.id === id ? { ...a, ...patch } : a)) });
  }
  function removeAd(id: string) {
    update({ ...config, ads: config.ads.filter((a) => a.id !== id) });
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">페이지 빌더</h1>
            <StatusBadge status="demo" />
          </div>
          <p className="mt-1 text-[var(--muted)]">홈 화면 섹션 순서·표시와 광고 배너를 직접 구성합니다. (변경은 브라우저에 저장됩니다.)</p>
        </div>
        <div className="flex gap-2">
          <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 rounded-lg border bg-[var(--surface)] px-3 py-2 text-sm font-medium hover:bg-[var(--surface-2)]">
            <ExternalLink size={15} /> 홈에서 미리보기
          </Link>
          <button onClick={persist} className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold">
            <Save size={15} /> {saved ? "저장됨!" : "저장"}
          </button>
        </div>
      </div>

      {/* 섹션 순서 */}
      <section className="mt-8">
        <h2 className="mb-3 font-bold">홈 섹션 구성</h2>
        <div className="card divide-y">
          {config.sections.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3 p-3">
              <div className="flex flex-col">
                <button onClick={() => moveSection(i, -1)} disabled={i === 0} className="text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30"><ArrowUp size={16} /></button>
                <button onClick={() => moveSection(i, 1)} disabled={i === config.sections.length - 1} className="text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30"><ArrowDown size={16} /></button>
              </div>
              <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--surface-2)] text-xs font-semibold">{i + 1}</span>
              <span className={`flex-1 text-sm font-medium ${s.enabled ? "" : "text-[var(--muted)] line-through"}`}>{s.label}</span>
              <button onClick={() => toggleSection(i)}
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${s.enabled ? "text-[var(--live)]" : "text-[var(--muted)]"}`}>
                {s.enabled ? <><Eye size={14} /> 표시</> : <><EyeOff size={14} /> 숨김</>}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 광고 배너 */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">광고 · 프로모션 배너</h2>
          <button onClick={addAd} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-[var(--surface-2)]">
            <Plus size={15} /> 배너 추가
          </button>
        </div>

        {config.ads.length === 0 && (
          <p className="card p-6 text-center text-sm text-[var(--muted)]">등록된 배너가 없습니다. &ldquo;배너 추가&rdquo;로 홈 화면에 광고를 넣어보세요.</p>
        )}

        <div className="space-y-4">
          {config.ads.map((ad) => (
            <div key={ad.id} className="card p-4">
              <div className="mb-3 flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={ad.enabled} onChange={(e) => updateAd(ad.id, { enabled: e.target.checked })} />
                  노출 활성화
                </label>
                <button onClick={() => removeAd(ad.id)} className="text-[var(--muted)] hover:text-rose-500"><Trash2 size={16} /></button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="제목"><input className="i" value={ad.title} onChange={(e) => updateAd(ad.id, { title: e.target.value })} /></Field>
                <Field label="링크 (href)"><input className="i" value={ad.href} onChange={(e) => updateAd(ad.id, { href: e.target.value })} /></Field>
                <Field label="문구" full><input className="i" value={ad.text} onChange={(e) => updateAd(ad.id, { text: e.target.value })} /></Field>
                <Field label="버튼 라벨"><input className="i" value={ad.ctaLabel} onChange={(e) => updateAd(ad.id, { ctaLabel: e.target.value })} /></Field>
                <Field label="위치">
                  <select className="i" value={ad.placement} onChange={(e) => updateAd(ad.id, { placement: e.target.value as AdPlacement })}>
                    {(Object.keys(PLACEMENT_LABELS) as AdPlacement[]).map((p) => <option key={p} value={p}>{PLACEMENT_LABELS[p]}</option>)}
                  </select>
                </Field>
                <Field label="배경 색상">
                  <div className="flex gap-2">
                    {COLORS.map((c) => (
                      <button key={c} onClick={() => updateAd(ad.id, { color: c })}
                        className={`h-8 w-8 rounded-lg bg-gradient-to-br ${c === "indigo" ? "from-indigo-500 to-fuchsia-500" : c === "plum" ? "from-violet-600 to-indigo-500" : c === "amber" ? "from-amber-400 to-rose-500" : "from-slate-500 to-slate-700"} ${ad.color === c ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--surface)]" : ""}`} />
                    ))}
                  </div>
                </Field>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 flex items-center justify-between border-t pt-4">
        <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          <RotateCcw size={15} /> 기본값으로 초기화
        </button>
        <button onClick={persist} className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold">
          <Save size={15} /> {saved ? "저장됨!" : "변경사항 저장"}
        </button>
      </div>

      <p className="mt-4 rounded-lg bg-[var(--surface-2)] p-3 text-xs text-[var(--muted)]">
        프로토타입에서는 구성이 이 브라우저(localStorage)에 저장됩니다. 실서비스에서는 Supabase에 저장되어 모든 방문자에게 반영됩니다.
      </p>

      <style>{`.i{width:100%;border:1px solid var(--border);background:var(--surface);border-radius:.5rem;padding:.5rem .7rem;font-size:.85rem;outline:none}.i:focus{border-color:var(--accent)}`}</style>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-xs font-medium text-[var(--muted)]">{label}</span>
      {children}
    </label>
  );
}
