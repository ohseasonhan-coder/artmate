"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ChevronLeft } from "lucide-react";
import { getDemoArtist } from "@/lib/demo-data";
import StatusBadge from "@/components/StatusBadge";

const base = getDemoArtist("crossover-ensemble")!;

// 실제 AI 미연결 시 보여줄 샘플 결과
const SAMPLE = {
  introShort: base.introShort,
  strengths: base.strengths,
  careerSummary:
    "기업 창립기념식·시상식부터 지역 문화축제, 호텔 갈라디너까지 다양한 무대에서 검증된 크로스오버 앙상블입니다. 최근 1년간 12회 이상의 기업·공공 행사 공연 경력을 보유하고 있습니다.",
  featured: base.careers.filter((c) => c.isFeatured).map((c) => c.title),
};

export default function AiProfilePage() {
  const [phase, setPhase] = useState<"idle" | "loading" | "result">("idle");

  function run() {
    setPhase("loading");
    setTimeout(() => setPhase("result"), 1400);
  }

  return (
    <div className="max-w-2xl">
      <Link href="/dashboard/profile" className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
        <ChevronLeft size={16} /> 프로필 편집으로
      </Link>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">AI 프로필 자동 생성</h1>
        <StatusBadge status="demo" />
      </div>
      <p className="mt-2 rounded-lg bg-[var(--demo-soft)] p-3 text-sm text-[var(--demo)]">
        현재 AI 자동 분석 기능은 구현 중입니다. 테스트 기간에는 관리자 검토 또는 데모 결과가 제공됩니다.
      </p>

      {phase === "idle" && (
        <div className="mt-6 card p-6 text-center">
          <Sparkles size={36} className="mx-auto text-[var(--accent)]" />
          <p className="mt-3 font-medium">기존 자료를 분석해 프로필 초안을 생성합니다</p>
          <p className="mt-1 text-sm text-[var(--muted)]">한 문장 소개 · 핵심 강점 · 경력 요약 · 대표 경력 추천</p>
          <button onClick={run} className="btn-primary mt-4 rounded-lg px-5 py-2.5 text-sm font-semibold">AI 분석 시작 (데모)</button>
        </div>
      )}

      {phase === "loading" && (
        <div className="mt-6 card p-10 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          <p className="mt-4 text-sm text-[var(--muted)]">기존 프로필을 분석하고 있습니다…</p>
        </div>
      )}

      {phase === "result" && (
        <div className="mt-6 space-y-4">
          <Result title="한 문장 소개"><p>{SAMPLE.introShort}</p></Result>
          <Result title="핵심 강점">
            <div className="flex flex-wrap gap-2">
              {SAMPLE.strengths.map((s) => <span key={s} className="rounded-lg bg-[var(--surface-2)] px-3 py-1.5 text-sm">{s}</span>)}
            </div>
          </Result>
          <Result title="경력 요약"><p className="text-sm leading-relaxed">{SAMPLE.careerSummary}</p></Result>
          <Result title="대표 경력 추천">
            <ul className="list-inside list-disc text-sm">{SAMPLE.featured.map((c) => <li key={c}>{c}</li>)}</ul>
          </Result>
          <div className="flex gap-2">
            <Link href="/dashboard/profile" className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold">이 내용으로 프로필 반영</Link>
            <button onClick={() => setPhase("idle")} className="rounded-lg border bg-[var(--surface)] px-4 py-2 text-sm font-medium">다시 생성</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Result({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center gap-2">
        <Sparkles size={14} className="text-[var(--accent)]" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}
