"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Search } from "lucide-react";
import { DEMO_ARTISTS } from "@/lib/demo-data";
import StatusBadge, { DemoDataBadge } from "@/components/StatusBadge";
import Cover from "@/components/Cover";

const EXAMPLE = "서울에서 12월 송년회에 출연할 수 있는 밝은 분위기의 3~5인 공연팀을 찾아주세요.";

// 데모 매칭 결과 (AI 미연결 시)
const DEMO_RESULTS = DEMO_ARTISTS.map((a, i) => ({ artist: a, score: [96, 92, 88][i], reason: [
  "3~5인 편성, 기업행사 특화 선곡, 밝은 분위기에 부합",
  "송년회·호텔 행사 경험 다수, 세련된 라운지 무드",
  "가족·기업 행사 경험, 관객 참여형 밝은 구성",
][i] }));

interface ResultItem { artist: (typeof DEMO_ARTISTS)[number]; score: number; reason: string; }

export default function CompanySearchPage() {
  const [q, setQ] = useState("");
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState(false);
  const [results, setResults] = useState<ResultItem[]>(DEMO_RESULTS);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setSearched(true);
    setBusy(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "search",
          input: {
            query: q || EXAMPLE,
            artists: DEMO_ARTISTS.map((a) => ({
              slug: a.slug, artistName: a.artistName, mainCategory: a.mainCategory,
              mainRegion: a.mainRegion, availableRegions: a.availableRegions,
              teamSize: a.teamSize, durationMin: a.durationMin, strengths: a.strengths,
            })),
          },
        }),
      });
      const json = await res.json();
      if (json.configured && json.data?.results?.length) {
        const mapped: ResultItem[] = json.data.results
          .map((r: { slug: string; score: number; reason: string }) => {
            const artist = DEMO_ARTISTS.find((a) => a.slug === r.slug);
            return artist ? { artist, score: r.score, reason: r.reason } : null;
          })
          .filter(Boolean) as ResultItem[];
        setResults(mapped.length ? mapped : DEMO_RESULTS);
        setLive(true);
      } else {
        setResults(DEMO_RESULTS);
        setLive(false);
      }
    } catch {
      setResults(DEMO_RESULTS);
      setLive(false);
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">자연어 AI 검색</h1>
        <StatusBadge status={live ? "live" : "demo"} />
      </div>
      <p className="mt-2 rounded-lg bg-[var(--demo-soft)] p-3 text-sm text-[var(--demo)]">
        GEMINI_API_KEY 설정 시 실제 AI 매칭으로 동작합니다. 미설정 시 데모 추천을 표시합니다.
      </p>

      <form onSubmit={search} className="mt-5">
        <div className="flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={EXAMPLE}
            className="flex-1 rounded-xl border bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]" />
          <button disabled={busy} className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-4 text-sm font-semibold disabled:opacity-60">
            <Search size={16} /> {busy ? "검색 중…" : "검색"}
          </button>
        </div>
        <button type="button" onClick={() => setQ(EXAMPLE)} className="mt-2 text-xs text-[var(--accent)]">
          예시 질문 채우기
        </button>
      </form>

      {searched && (
        <div className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-[var(--accent)]" />
            <h2 className="font-bold">추천 결과</h2>
            {live ? <StatusBadge status="live" /> : <DemoDataBadge />}
          </div>
          <div className="space-y-3">
            {results.map(({ artist, score, reason }) => (
              <Link key={artist.slug} href={`/a/${artist.slug}`} className="card flex items-center gap-4 p-4 transition hover:border-[var(--accent)]/40">
                <Cover preset={artist.coverImage} className="h-16 w-16 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{artist.artistName}</p>
                    <span className="rounded-md bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]">매칭 {score}%</span>
                  </div>
                  <p className="mt-0.5 text-sm text-[var(--muted)]">{reason}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 rounded-xl border p-4 text-sm text-[var(--muted)]">
            후보 비교·인재풀·사내 검토보고서 기능은 <StatusBadge status="soon" className="mx-1" /> 상태로 준비 중입니다.
          </div>
        </div>
      )}
    </div>
  );
}
