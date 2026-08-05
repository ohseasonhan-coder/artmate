"use client";

import { useState } from "react";
import { Check, X, Sparkles } from "lucide-react";
import { DEMO_ARTISTS } from "@/lib/demo-data";
import StatusBadge, { DemoDataBadge } from "@/components/StatusBadge";

export default function ProfilesReviewPage() {
  const pending = DEMO_ARTISTS[2]; // 원더 매직 퍼포먼스 = 검토 대기
  const [intro, setIntro] = useState(pending.introShort);
  const [result, setResult] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">프로필 검토 · 공개 승인</h1>
        <StatusBadge status="demo" />
        <DemoDataBadge className="ml-1" />
      </div>
      <p className="mt-1 text-[var(--muted)]">AI가 생성한 프로필을 검토·수정한 뒤 공개를 승인합니다.</p>

      <div className="mt-6 card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">{pending.artistName}</h2>
            <p className="text-sm text-[var(--muted)]">{pending.mainCategory} · {pending.profileType} {pending.teamSize}인</p>
          </div>
          <span className="rounded-md bg-[var(--demo-soft)] px-2 py-1 text-xs font-medium text-[var(--demo)]">검토 대기</span>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
            <Sparkles size={14} className="text-[var(--accent)]" /> AI 생성 소개문 (수정 가능)
          </div>
          <textarea rows={3} value={intro} onChange={(e) => setIntro(e.target.value)}
            className="w-full rounded-lg border bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]" />
        </div>

        {result ? (
          <p className={`mt-4 rounded-lg p-3 text-sm font-medium ${result === "승인" ? "bg-[var(--live-soft)] text-[var(--live)]" : "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300"}`}>
            {result === "승인" ? "프로필이 공개 승인되었습니다." : "반려 처리되었습니다. 사용자에게 사유가 전달됩니다."}
          </p>
        ) : (
          <div className="mt-4 flex gap-2 border-t pt-4">
            <button onClick={() => setResult("승인")} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--live)] px-4 py-2 text-sm font-semibold text-white">
              <Check size={15} /> 공개 승인
            </button>
            <button onClick={() => setResult("반려")} className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-[var(--surface-2)]">
              <X size={15} /> 반려
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
