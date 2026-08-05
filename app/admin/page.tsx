"use client";

import { useEffect, useState } from "react";
import { Users, FileCheck, MessageSquare, BarChart3 } from "lucide-react";
import { FEATURE_MAP } from "@/lib/features";
import { countLocalInterests } from "@/lib/interests";
import StatusBadge, { DemoDataBadge } from "@/components/StatusBadge";

// 데모용 기본 관심도 (실제로는 feature_interests 집계)
const BASE_COUNTS: Record<string, number> = {
  gcal: 14, studio: 11, grants: 8, contracts: 7, gmail: 6, "ai-search": 9, passport: 5, team: 4,
};

export default function AdminPage() {
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
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">관리자 콘솔</h1>
        <StatusBadge status="demo" />
      </div>
      <p className="mt-1 text-[var(--muted)]">사용자·프로필·문의·기능 관심도를 관리합니다.</p>

      {/* 요약 */}
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <Stat icon={Users} label="가입 사용자" value="3" />
        <Stat icon={FileCheck} label="검토 대기 프로필" value="1" />
        <Stat icon={MessageSquare} label="전체 기업 문의" value="3" />
        <Stat icon={BarChart3} label="기능 관심 등록" value={String(ranked.reduce((s, [, v]) => s + v, 0))} />
      </div>

      {/* 기능 관심도 */}
      <div className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="font-bold">기능 관심도</h2>
          <DemoDataBadge />
        </div>
        <div className="card divide-y">
          {ranked.map(([key, count]) => (
            <div key={key} className="flex items-center gap-3 p-3">
              <span className="w-44 shrink-0 truncate text-sm font-medium">
                {FEATURE_MAP[key]?.title ?? key}
              </span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
                <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${(count / max) * 100}%` }} />
              </div>
              <span className="w-12 shrink-0 text-right text-sm font-semibold">{count}명</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          비로그인 사용자의 관심 등록은 브라우저(localStorage)에 임시 저장되며, 위 수치에 합산되어 표시됩니다.
        </p>
      </div>

      {/* 관리 메뉴 (프로토타입) */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {["사용자 목록", "프로필 검토·공개 승인", "AI 결과 수정", "기업 문의 관리", "콘텐츠 신고", "사용자 피드백", "샘플 데이터 관리"].map((m) => (
          <div key={m} className="card flex items-center justify-between p-4">
            <span className="text-sm font-medium">{m}</span>
            <StatusBadge status="soon" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon size={18} /></span>
      <div>
        <p className="text-xs text-[var(--muted)]">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}
