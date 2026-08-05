import { FEATURES, STATUS_META } from "@/lib/features";
import FeatureCard from "@/components/FeatureCard";
import StatusBadge from "@/components/StatusBadge";
import type { FeatureStatus } from "@/lib/types";

export const metadata = { title: "기능 전체보기 · 아트메이트 AI" };

const GROUPS = ["프로필·섭외", "일정·활동", "AI·자동화", "연동", "기업", "관리"] as const;

export default function FeaturesPage() {
  const counts = FEATURES.reduce(
    (acc, f) => ((acc[f.status] = (acc[f.status] ?? 0) + 1), acc),
    {} as Record<FeatureStatus, number>,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">기능 전체보기</h1>
      <p className="mt-2 text-[var(--muted)]">
        아트메이트 AI가 나아갈 전체 방향입니다. 각 기능의 현재 상태를 명확히 표시합니다.
      </p>

      {/* 상태 범례 */}
      <div className="mt-5 flex flex-wrap gap-3 rounded-xl border bg-[var(--surface)] p-4">
        {(["live", "demo", "soon"] as FeatureStatus[]).map((s) => (
          <div key={s} className="flex items-center gap-2 text-sm">
            <StatusBadge status={s} />
            <span className="text-[var(--muted)]">
              {s === "live" && "실제 데이터 저장·수정 가능"}
              {s === "demo" && STATUS_META.demo.note}
              {s === "soon" && STATUS_META.soon.note}
            </span>
            <span className="font-semibold">· {counts[s] ?? 0}개</span>
          </div>
        ))}
      </div>

      {GROUPS.map((g) => {
        const items = FEATURES.filter((f) => f.group === g);
        if (!items.length) return null;
        return (
          <section key={g} className="mt-10">
            <h2 className="mb-3 text-lg font-bold">{g}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((f) => (
                <FeatureCard key={f.key} feature={f} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
