"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, ImageIcon, Video, Plus, ChevronLeft, X } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { isDemoMode } from "@/lib/config";

export default function UploadPage() {
  const router = useRouter();
  const [pdf, setPdf] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([""]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/onboarding" className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
        <ChevronLeft size={16} /> 온보딩으로
      </Link>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">자료 등록</h1>
        <StatusBadge status="live" />
      </div>
      <p className="mt-1 text-[var(--muted)]">
        가지고 계신 자료를 올려주세요. 대용량 영상은 저장하지 않고 YouTube 링크로 등록합니다.
      </p>
      {isDemoMode && (
        <p className="mt-3 rounded-lg bg-[var(--demo-soft)] p-3 text-sm text-[var(--demo)]">
          데모 모드에서는 실제 업로드 없이 파일 이름만 표시됩니다.
        </p>
      )}

      {/* 프로필 PDF */}
      <Card icon={FileText} title="프로필 PDF / 이력서" hint="기존에 쓰던 소개서가 있다면 올려주세요">
        {pdf ? (
          <Chip label={pdf} onRemove={() => setPdf(null)} />
        ) : (
          <FilePicker accept=".pdf" onPick={(name) => setPdf(name)} label="PDF 선택" />
        )}
      </Card>

      {/* 사진 */}
      <Card icon={ImageIcon} title="대표 사진 · 공연 사진" hint="여러 장 올릴 수 있습니다">
        <div className="flex flex-wrap gap-2">
          {photos.map((p, i) => (
            <Chip key={i} label={p} onRemove={() => setPhotos((ps) => ps.filter((_, j) => j !== i))} />
          ))}
          <FilePicker accept="image/*" onPick={(name) => setPhotos((ps) => [...ps, name])} label="사진 추가" />
        </div>
      </Card>

      {/* YouTube */}
      <Card icon={Video} title="YouTube 영상 링크" hint="공연 영상 링크를 붙여넣으세요">
        <div className="space-y-2">
          {links.map((l, i) => (
            <div key={i} className="flex gap-2">
              <input value={l} onChange={(e) => setLinks((ls) => ls.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder="https://youtu.be/..." className="flex-1 rounded-lg border bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]" />
              {links.length > 1 && (
                <button onClick={() => setLinks((ls) => ls.filter((_, j) => j !== i))} className="rounded-lg border px-2 text-[var(--muted)]"><X size={15} /></button>
              )}
            </div>
          ))}
          <button onClick={() => setLinks((ls) => [...ls, ""])} className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
            <Plus size={14} /> 링크 추가
          </button>
        </div>
      </Card>

      <div className="mt-6 flex justify-end gap-2">
        <Link href="/dashboard" className="rounded-lg border bg-[var(--surface)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--surface-2)]">나중에 하기</Link>
        <button onClick={() => router.push("/onboarding/analyzing")} className="btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold">
          AI 분석 시작
        </button>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, hint, children }: { icon: React.ElementType; title: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 card p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={18} className="text-[var(--accent)]" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mb-3 text-xs text-[var(--muted)]">{hint}</p>
      {children}
    </div>
  );
}

function FilePicker({ accept, onPick, label }: { accept: string; onPick: (name: string) => void; label: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed px-4 py-2 text-sm font-medium text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]">
      <Plus size={15} /> {label}
      <input type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onPick(f.name); e.target.value = ""; }} />
    </label>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[var(--surface-2)] px-3 py-1.5 text-sm">
      <span className="truncate">{label}</span>
      <button onClick={onRemove} className="text-[var(--muted)] hover:text-[var(--foreground)]"><X size={14} /></button>
    </span>
  );
}
