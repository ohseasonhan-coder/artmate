"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUp, ArrowDown, Eye, EyeOff, Plus, Trash2, ExternalLink, Save, RotateCcw,
  GripVertical, Megaphone, Type, Bell, Image as ImageIcon, Film, Minus,
  Monitor, Smartphone, RefreshCw, Palette, Cloud, HardDrive,
} from "lucide-react";
import {
  DEFAULT_CONFIG, loadConfig, saveConfig, newBlock, parseYoutubeId, BLOCK_LABELS, CUSTOM_TYPES,
  COLOR_PRESETS, ACCENT_PRESETS,
  type SiteConfig, type Block, type BlockType,
  type NoticeBlock, type TextBlock, type AdBlock, type ImageBlock, type VideoBlock,
} from "@/lib/site-config";
import StatusBadge from "@/components/StatusBadge";
import ImageUpload from "@/components/ImageUpload";

const ADD_MENU: { type: BlockType; icon: React.ElementType; label: string }[] = [
  { type: "notice", icon: Bell, label: "공지" },
  { type: "text", icon: Type, label: "텍스트" },
  { type: "ad", icon: Megaphone, label: "광고" },
  { type: "image", icon: ImageIcon, label: "이미지" },
  { type: "video", icon: Film, label: "영상" },
  { type: "divider", icon: Minus, label: "구분선" },
];

export default function BuilderPage() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [source, setSource] = useState<"supabase" | "local">("local");
  const [saved, setSaved] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const loaded = useRef(false);

  // 로드: Supabase에 저장된 설정이 있으면 그것을, 없으면 localStorage
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/site-config");
        const data = await res.json();
        if (data.source === "supabase") {
          setConfig(data.config);
          setSource("supabase");
        } else {
          setConfig(loadConfig());
          setSource("local");
        }
      } catch {
        setConfig(loadConfig());
      } finally {
        loaded.current = true;
      }
    })();
  }, []);

  function update(next: SiteConfig, refresh = false) {
    setConfig(next);
    if (loaded.current) saveConfig(next); // 로컬 미리보기용 캐시
    setSaved(null);
    if (refresh && source === "local") setPreviewKey((k) => k + 1);
  }

  async function save() {
    saveConfig(config);
    // Supabase 연결 시 서버에 저장(모든 방문자 공유)
    try {
      const res = await fetch("/api/site-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      if (res.ok) {
        setSource("supabase");
        setSaved("모든 방문자에게 반영되었습니다.");
      } else {
        setSaved("이 브라우저에 저장되었습니다. (Supabase 미연결)");
      }
    } catch {
      setSaved("이 브라우저에 저장되었습니다.");
    }
    setPreviewKey((k) => k + 1);
    setTimeout(() => setSaved(null), 2500);
  }

  function reset() { update(structuredClone(DEFAULT_CONFIG), true); }
  function refreshPreview() { saveConfig(config); setPreviewKey((k) => k + 1); }

  // ── 블록 조작 ──
  function move(i: number, dir: -1 | 1) {
    const arr = [...config.blocks];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    update({ ...config, blocks: arr }, true);
  }
  function drop(target: number) {
    if (dragIndex === null || dragIndex === target) return setDragIndex(null);
    const arr = [...config.blocks];
    const [moved] = arr.splice(dragIndex, 1);
    arr.splice(target, 0, moved);
    update({ ...config, blocks: arr }, true);
    setDragIndex(null);
  }
  function toggle(id: string) {
    update({ ...config, blocks: config.blocks.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)) }, true);
  }
  function remove(id: string) {
    update({ ...config, blocks: config.blocks.filter((b) => b.id !== id) }, true);
  }
  function add(type: BlockType) {
    update({ ...config, blocks: [...config.blocks, newBlock(type)] }, true);
  }
  function patch(id: string, p: Partial<Block>) {
    update({ ...config, blocks: config.blocks.map((b) => (b.id === id ? ({ ...b, ...p } as Block) : b)) });
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">페이지 빌더</h1>
            <StatusBadge status="demo" />
            <span className="inline-flex items-center gap-1 rounded-md bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--muted)]">
              {source === "supabase" ? <><Cloud size={12} /> 전체 공유</> : <><HardDrive size={12} /> 이 브라우저</>}
            </span>
          </div>
          <p className="mt-1 text-[var(--muted)]">홈 화면을 블록으로 구성합니다. 드래그로 순서를 바꾸고 다양한 블록을 추가하세요.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 rounded-lg border bg-[var(--surface)] px-3 py-2 text-sm font-medium hover:bg-[var(--surface-2)]">
            <ExternalLink size={15} /> 새 탭
          </Link>
          <button onClick={save} className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold">
            <Save size={15} /> 저장
          </button>
        </div>
      </div>
      {saved && <p className="mt-3 rounded-lg bg-[var(--live-soft)] p-2.5 text-sm text-[var(--live)]">{saved}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(360px,42%)]">
        {/* ── 편집 패널 ── */}
        <div className="space-y-8">
          {/* 테마 */}
          <section>
            <h2 className="mb-3 flex items-center gap-1.5 font-bold"><Palette size={16} /> 테마 색상</h2>
            <div className="card flex flex-wrap items-center gap-3 p-4">
              {ACCENT_PRESETS.map((a) => (
                <button key={a.value} title={a.name} onClick={() => update({ ...config, theme: { accent: a.value } }, true)}
                  className="h-8 w-8 rounded-full transition"
                  style={{ background: a.value, boxShadow: config.theme.accent === a.value ? `0 0 0 2px var(--surface), 0 0 0 4px ${a.value}` : undefined }} />
              ))}
              <label className="ml-2 inline-flex items-center gap-2 text-sm text-[var(--muted)]">
                직접 선택
                <input type="color" value={config.theme.accent} onChange={(e) => update({ ...config, theme: { accent: e.target.value } }, true)}
                  className="h-8 w-10 cursor-pointer rounded border bg-transparent" />
              </label>
            </div>
          </section>

          {/* 히어로 */}
          <section>
            <h2 className="mb-3 font-bold">히어로 문구</h2>
            <div className="card space-y-3 p-4">
              <HeroField label="배지" value={config.hero.badge} onChange={(v) => update({ ...config, hero: { ...config.hero, badge: v } })} />
              <HeroField label="제목" value={config.hero.title} onChange={(v) => update({ ...config, hero: { ...config.hero, title: v } })} textarea />
              <HeroField label="부제" value={config.hero.subtitle} onChange={(v) => update({ ...config, hero: { ...config.hero, subtitle: v } })} textarea />
              <div className="grid gap-3 sm:grid-cols-2">
                <HeroField label="기본 버튼" value={config.hero.primaryLabel} onChange={(v) => update({ ...config, hero: { ...config.hero, primaryLabel: v } })} />
                <HeroField label="기본 버튼 링크" value={config.hero.primaryHref} onChange={(v) => update({ ...config, hero: { ...config.hero, primaryHref: v } })} />
                <HeroField label="보조 버튼" value={config.hero.secondaryLabel} onChange={(v) => update({ ...config, hero: { ...config.hero, secondaryLabel: v } })} />
                <HeroField label="보조 버튼 링크" value={config.hero.secondaryHref} onChange={(v) => update({ ...config, hero: { ...config.hero, secondaryHref: v } })} />
              </div>
            </div>
          </section>

          {/* 블록 목록 */}
          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-bold">블록 구성</h2>
              <div className="flex flex-wrap gap-1">
                {ADD_MENU.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button key={m.type} onClick={() => add(m.type)}
                      className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium hover:bg-[var(--surface-2)]">
                      <Plus size={12} /> <Icon size={13} /> {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              {config.blocks.map((b, i) => {
                const custom = CUSTOM_TYPES.includes(b.type);
                return (
                  <div key={b.id} draggable
                    onDragStart={() => setDragIndex(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => drop(i)}
                    className={`card p-3 ${dragIndex === i ? "opacity-50" : ""}`}>
                    <div className="flex items-center gap-2">
                      <GripVertical size={16} className="cursor-grab text-[var(--muted)]" />
                      <div className="flex flex-col">
                        <button onClick={() => move(i, -1)} disabled={i === 0} className="text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30"><ArrowUp size={14} /></button>
                        <button onClick={() => move(i, 1)} disabled={i === config.blocks.length - 1} className="text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30"><ArrowDown size={14} /></button>
                      </div>
                      <span className={`flex-1 text-sm font-medium ${b.enabled ? "" : "text-[var(--muted)] line-through"}`}>
                        {BLOCK_LABELS[b.type]}
                        {!custom && <span className="ml-1.5 rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-[10px] text-[var(--muted)]">기본</span>}
                      </span>
                      <button onClick={() => toggle(b.id)} className={`rounded-lg border px-2 py-1 text-xs ${b.enabled ? "text-[var(--live)]" : "text-[var(--muted)]"}`}>
                        {b.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      {custom && <button onClick={() => remove(b.id)} className="text-[var(--muted)] hover:text-rose-500"><Trash2 size={15} /></button>}
                    </div>

                    {b.type === "notice" && <NoticeEditor block={b as NoticeBlock} onPatch={(p) => patch(b.id, p)} />}
                    {b.type === "text" && <TextEditor block={b as TextBlock} onPatch={(p) => patch(b.id, p)} />}
                    {b.type === "ad" && <AdEditor block={b as AdBlock} onPatch={(p) => patch(b.id, p)} />}
                    {b.type === "image" && <ImageEditor block={b as ImageBlock} onPatch={(p) => patch(b.id, p)} />}
                    {b.type === "video" && <VideoEditor block={b as VideoBlock} onPatch={(p) => patch(b.id, p)} />}
                    {b.type === "divider" && <p className="mt-2 border-t pt-2 text-xs text-[var(--muted)]">가로 구분선</p>}
                  </div>
                );
              })}
            </div>
          </section>

          <div className="flex items-center justify-between border-t pt-4">
            <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
              <RotateCcw size={15} /> 기본값으로 초기화
            </button>
            <button onClick={save} className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold">
              <Save size={15} /> 변경사항 저장
            </button>
          </div>
        </div>

        {/* ── 실시간 미리보기 ── */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">실시간 미리보기</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setDevice("desktop")} className={`rounded-lg border p-1.5 ${device === "desktop" ? "bg-[var(--accent)] text-[var(--accent-fg)]" : ""}`}><Monitor size={15} /></button>
              <button onClick={() => setDevice("mobile")} className={`rounded-lg border p-1.5 ${device === "mobile" ? "bg-[var(--accent)] text-[var(--accent-fg)]" : ""}`}><Smartphone size={15} /></button>
              <button onClick={refreshPreview} className="rounded-lg border p-1.5 hover:bg-[var(--surface-2)]"><RefreshCw size={15} /></button>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border bg-[var(--surface-2)] p-3">
            <div className={`mx-auto overflow-hidden rounded-lg border bg-[var(--surface)] shadow-sm transition-all ${device === "mobile" ? "w-[390px] max-w-full" : "w-full"}`}>
              <iframe key={previewKey} src="/" title="홈 미리보기" className="h-[600px] w-full" />
            </div>
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">텍스트 수정 후에는 새로고침(↻) 버튼으로 미리보기를 갱신하세요.</p>
        </div>
      </div>

      <p className="mt-6 rounded-lg bg-[var(--surface-2)] p-3 text-xs text-[var(--muted)]">
        {source === "supabase"
          ? "Supabase에 저장되어 모든 방문자에게 동일하게 보입니다."
          : "현재 이 브라우저(localStorage)에만 저장됩니다. Supabase 환경변수를 설정하면 모든 방문자에게 반영됩니다."}
      </p>

      <style>{`.i{width:100%;border:1px solid var(--border);background:var(--surface);border-radius:.5rem;padding:.5rem .7rem;font-size:.85rem;outline:none}.i:focus{border-color:var(--accent)}`}</style>
    </div>
  );
}

function HeroField({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[var(--muted)]">{label}</span>
      {textarea
        ? <textarea rows={2} className="i" value={value} onChange={(e) => onChange(e.target.value)} />
        : <input className="i" value={value} onChange={(e) => onChange(e.target.value)} />}
    </label>
  );
}

function ColorSwatches({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex gap-2">
      {COLOR_PRESETS.map((c) => (
        <button key={c} onClick={() => onChange(c)}
          className={`h-7 w-7 rounded-lg bg-gradient-to-br ${c === "indigo" ? "from-indigo-500 to-fuchsia-500" : c === "plum" ? "from-violet-600 to-indigo-500" : c === "amber" ? "from-amber-400 to-rose-500" : "from-slate-500 to-slate-700"} ${value === c ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--surface)]" : ""}`} />
      ))}
    </div>
  );
}

function NoticeEditor({ block, onPatch }: { block: NoticeBlock; onPatch: (p: Partial<NoticeBlock>) => void }) {
  return (
    <div className="mt-3 space-y-2 border-t pt-3">
      <input className="i" value={block.text} onChange={(e) => onPatch({ text: e.target.value })} placeholder="공지 문구" />
      <ColorSwatches value={block.color} onChange={(c) => onPatch({ color: c })} />
    </div>
  );
}

function TextEditor({ block, onPatch }: { block: TextBlock; onPatch: (p: Partial<TextBlock>) => void }) {
  return (
    <div className="mt-3 space-y-2 border-t pt-3">
      <input className="i" value={block.title} onChange={(e) => onPatch({ title: e.target.value })} placeholder="제목" />
      <textarea rows={3} className="i" value={block.body} onChange={(e) => onPatch({ body: e.target.value })} placeholder="내용" />
      <div className="flex gap-2">
        {(["left", "center"] as const).map((a) => (
          <button key={a} onClick={() => onPatch({ align: a })}
            className={`rounded-lg border px-3 py-1 text-xs font-medium ${block.align === a ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]" : ""}`}>
            {a === "left" ? "왼쪽 정렬" : "가운데 정렬"}
          </button>
        ))}
      </div>
    </div>
  );
}

function AdEditor({ block, onPatch }: { block: AdBlock; onPatch: (p: Partial<AdBlock>) => void }) {
  return (
    <div className="mt-3 grid gap-2 border-t pt-3 sm:grid-cols-2">
      <input className="i" value={block.title} onChange={(e) => onPatch({ title: e.target.value })} placeholder="제목" />
      <input className="i" value={block.href} onChange={(e) => onPatch({ href: e.target.value })} placeholder="링크 (예: /dashboard/studio)" />
      <input className="i sm:col-span-2" value={block.text} onChange={(e) => onPatch({ text: e.target.value })} placeholder="문구" />
      <input className="i" value={block.ctaLabel} onChange={(e) => onPatch({ ctaLabel: e.target.value })} placeholder="버튼 라벨" />
      <div className="flex items-center"><ColorSwatches value={block.color} onChange={(c) => onPatch({ color: c })} /></div>
    </div>
  );
}

function ImageEditor({ block, onPatch }: { block: ImageBlock; onPatch: (p: Partial<ImageBlock>) => void }) {
  return (
    <div className="mt-3 space-y-2 border-t pt-3">
      <ImageUpload value={block.url} onChange={(url) => onPatch({ url })} />
      <input className="i" value={block.alt} onChange={(e) => onPatch({ alt: e.target.value })} placeholder="이미지 설명(alt)" />
      <input className="i" value={block.href} onChange={(e) => onPatch({ href: e.target.value })} placeholder="클릭 시 이동할 링크 (선택)" />
    </div>
  );
}

function VideoEditor({ block, onPatch }: { block: VideoBlock; onPatch: (p: Partial<VideoBlock>) => void }) {
  return (
    <div className="mt-3 space-y-2 border-t pt-3">
      <input className="i" value={block.title} onChange={(e) => onPatch({ title: e.target.value })} placeholder="영상 제목" />
      <input className="i" value={block.youtubeId}
        onChange={(e) => onPatch({ youtubeId: parseYoutubeId(e.target.value) || e.target.value })}
        placeholder="YouTube URL 또는 영상 ID 붙여넣기" />
      {block.youtubeId && <p className="text-xs text-[var(--muted)]">영상 ID: {block.youtubeId}</p>}
    </div>
  );
}
