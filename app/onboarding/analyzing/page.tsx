"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

const TASKS = [
  "기존 프로필 자료 분석",
  "한 문장 소개 생성",
  "핵심 강점 추출",
  "경력 요약 정리",
  "대표 경력·사진 추천",
];

export default function AnalyzingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < TASKS.length) {
      const t = setTimeout(() => setStep((s) => s + 1), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => router.push("/onboarding/select"), 800);
    return () => clearTimeout(t);
  }, [step, router]);

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-xl font-bold">AI가 프로필을 만들고 있어요</h1>
          <StatusBadge status="demo" />
        </div>
        <p className="mt-2 text-sm text-[var(--muted)]">잠시만 기다려 주세요…</p>
      </div>

      <div className="mt-8 card p-6">
        <ul className="space-y-3">
          {TASKS.map((t, i) => (
            <li key={t} className="flex items-center gap-3 text-sm">
              {i < step ? (
                <CheckCircle2 size={18} className="text-[var(--live)]" />
              ) : i === step ? (
                <Loader2 size={18} className="animate-spin text-[var(--accent)]" />
              ) : (
                <span className="h-[18px] w-[18px] rounded-full border-2 border-[var(--border)]" />
              )}
              <span className={i < step ? "text-[var(--muted)]" : i === step ? "font-medium" : "text-[var(--muted)]/60"}>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-center text-xs text-[var(--muted)]">
        실제 AI 자동 분석은 구현 중입니다. 테스트 기간에는 관리자 검토 또는 데모 결과가 제공됩니다.
      </p>
    </div>
  );
}
