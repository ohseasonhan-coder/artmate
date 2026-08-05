import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { FeatureDef } from "@/lib/features";
import StatusBadge from "./StatusBadge";

export default function FeatureCard({ feature }: { feature: FeatureDef }) {
  const inner = (
    <div className="card group flex h-full flex-col p-4 transition hover:border-[var(--accent)]/40 hover:shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug">{feature.title}</h3>
        <StatusBadge status={feature.status} />
      </div>
      <p className="flex-1 text-sm text-[var(--muted)]">{feature.desc}</p>
      {feature.href && (
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
          {feature.status === "live" ? "사용하기" : "미리보기"}
          <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
        </span>
      )}
    </div>
  );
  return feature.href ? <Link href={feature.href}>{inner}</Link> : inner;
}
