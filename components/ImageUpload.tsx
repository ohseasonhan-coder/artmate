"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, X } from "lucide-react";

const MAX_DATAURL = 1.5 * 1024 * 1024; // 데모(data URL) 저장 권장 최대 1.5MB

/**
 * 이미지 업로드.
 * - Supabase Storage 연결 시 /api/upload 로 업로드하고 공개 URL 반환.
 * - 미연결(데모) 시 파일을 data URL로 읽어 localStorage 설정에 저장.
 */
export default function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function handle(file: File) {
    setBusy(true);
    setNote(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
        return;
      }
      // Storage 미설정(501) 등 → data URL 폴백
      if (file.size > MAX_DATAURL) {
        setNote("Storage 미연결 상태에서는 1.5MB 이하 이미지만 저장됩니다.");
        return;
      }
      const dataUrl = await readAsDataURL(file);
      onChange(dataUrl);
      setNote("데모 모드: 이미지가 브라우저에 data URL로 저장되었습니다.");
    } catch {
      setNote("업로드에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="미리보기" className="h-24 w-40 rounded-lg border object-cover" />
          <button onClick={() => onChange("")} className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-[var(--foreground)] text-[var(--background)]">
            <X size={13} />
          </button>
        </div>
      ) : (
        <button onClick={() => inputRef.current?.click()} disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed px-4 py-3 text-sm font-medium text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-60">
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {busy ? "업로드 중…" : "이미지 선택"}
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); e.target.value = ""; }} />
      {note && <p className="mt-1.5 text-xs text-[var(--muted)]">{note}</p>}
    </div>
  );
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
