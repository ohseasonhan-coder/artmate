"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButton({ label = "공유" }: { label?: string }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ url });
        return;
      } catch {
        /* 취소 시 복사로 폴백 */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  }
  return (
    <button onClick={share}
      className="inline-flex items-center gap-1.5 rounded-lg border bg-[var(--surface)] px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--surface-2)]">
      {copied ? <Check size={15} className="text-[var(--live)]" /> : <Share2 size={15} />}
      {copied ? "링크 복사됨" : label}
    </button>
  );
}
