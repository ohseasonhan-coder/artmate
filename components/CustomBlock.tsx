import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Block, NoticeBlock, TextBlock, AdBlock } from "@/lib/site-config";
import Cover from "./Cover";

const NOTICE_BG: Record<string, string> = {
  indigo: "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/20",
  plum: "bg-[var(--soon-soft)] text-[var(--soon)] border-[var(--soon)]/20",
  amber: "bg-[var(--demo-soft)] text-[var(--demo)] border-[var(--demo)]/20",
  default: "bg-[var(--surface-2)] text-[var(--foreground)] border-[var(--border)]",
};

/** 관리자가 추가한 커스텀 블록(공지 바·텍스트·광고 배너) 렌더러 */
export default function CustomBlock({ block }: { block: Block }) {
  if (!block.enabled) return null;

  if (block.type === "notice") {
    const b = block as NoticeBlock;
    return (
      <div className={`border-y px-4 py-2.5 text-center text-sm font-medium ${NOTICE_BG[b.color] ?? NOTICE_BG.default}`}>
        {b.text}
      </div>
    );
  }

  if (block.type === "text") {
    const b = block as TextBlock;
    return (
      <section className="mx-auto max-w-3xl px-4 py-10">
        <div className={b.align === "center" ? "text-center" : "text-left"}>
          {b.title && <h2 className="text-xl font-bold">{b.title}</h2>}
          {b.body && <p className="mt-2 whitespace-pre-line leading-relaxed text-[var(--muted)]">{b.body}</p>}
        </div>
      </section>
    );
  }

  if (block.type === "ad") {
    const b = block as AdBlock;
    return (
      <section className="mx-auto max-w-6xl px-4 py-4">
        <div className="card relative overflow-hidden">
          <span className="absolute right-3 top-3 z-10 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white">AD</span>
          <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
            <div className="flex items-center gap-4 p-5">
              <Cover preset={b.color} className="hidden h-20 w-20 shrink-0 sm:block" />
              <div>
                <h3 className="text-lg font-bold">{b.title}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{b.text}</p>
              </div>
            </div>
            {b.href && b.ctaLabel && (
              <div className="px-5 pb-5 md:pb-0 md:pr-5">
                <Link href={b.href} className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold">
                  {b.ctaLabel} <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return null;
}
