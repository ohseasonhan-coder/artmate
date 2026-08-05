"use client";

import { useEffect, useState } from "react";
import { FEATURE_MAP } from "@/lib/features";
import { countLocalInterests } from "@/lib/interests";
import StatusBadge, { DemoDataBadge } from "@/components/StatusBadge";

const BASE_COUNTS: Record<string, number> = {
  gcal: 14, studio: 11, grants: 8, contracts: 7, gmail: 6, "ai-search": 9, passport: 5, team: 4,
};

export default function InterestsPage() {
  const [counts, setCounts] = useState<Record<string, number>>(BASE_COUNTS);

  useEffect(() => {
    const local = countLocalInterests();
    setCounts((prev) => {
      const merged = { ...prev };
      for (const [k, v] of Object.entries(local)) merged[k] = (merged[k] ?? 0) + v;
      return merged;
    });
  }, []);

  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...ranked.map(([, v]) => v), 1);

  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">기능 관심도</h1>
        <StatusBadge status="demo" />
        <DemoDataBadge className="ml-1" />
      </div>
      <p className="mt-1 text-[var(--muted)]">구현 중 기능에 대한 사용자 관심 등록을 집계해 개발 우선순위를 정합니다.</p>

      <div className="mt-6 card divide-y">
        {ranked.map(([key, count]) => (
          <div key={key} className="flex items-center gap-3 p-3">
            <span className="w-44 shrink-0 truncate text-sm font-medium">{FEATURE_MAP[key]?.title ?? key}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
              <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${(count / max) * 100}%` }} />
            </div>
            <span className="w-12 shrink-0 text-right text-sm font-semibold">{count}명</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-[var(--muted)]">
        비로그인 사용자의 관심 등록은 브라우저(localStorage)에 임시 저장되어 위 수치에 합산됩니다.
      </p>
    </div>
  );
}
