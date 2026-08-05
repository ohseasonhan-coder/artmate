import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AdSlot as Ad } from "@/lib/site-config";
import Cover from "./Cover";

/** 관리자가 삽입한 광고/프로모션 배너 */
export default function AdSlot({ ad }: { ad: Ad }) {
  if (!ad.enabled) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-4">
      <div className="card relative overflow-hidden">
        <span className="absolute right-3 top-3 z-10 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white">
          AD
        </span>
        <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
          <div className="flex items-center gap-4 p-5">
            <Cover preset={ad.color} className="hidden h-20 w-20 shrink-0 sm:block" />
            <div>
              <h3 className="text-lg font-bold">{ad.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{ad.text}</p>
            </div>
          </div>
          {ad.href && ad.ctaLabel && (
            <div className="px-5 pb-5 md:pb-0 md:pr-5">
              <Link href={ad.href} className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold">
                {ad.ctaLabel} <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
