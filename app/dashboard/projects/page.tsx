"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Trophy } from "lucide-react";
import StatusBadge, { DemoDataBadge } from "@/components/StatusBadge";

interface Check { id: string; label: string; done: boolean; }
interface Project {
  id: string; name: string; company: string; date: string; location: string;
  status: "준비 중" | "진행 중" | "완료"; checklist: Check[]; careerAdded: boolean;
}

const INITIAL: Project[] = [
  {
    id: "p1", name: "그랜드호텔 연말 갈라디너", company: "그랜드호텔", date: "2026-08-08",
    location: "그랜드볼룸", status: "진행 중", careerAdded: false,
    checklist: [
      { id: "c1", label: "선곡 리스트 확정", done: true },
      { id: "c2", label: "음향 장비 확인", done: true },
      { id: "c3", label: "리허설 일정 조율", done: false },
      { id: "c4", label: "복장·의상 준비", done: false },
    ],
  },
  {
    id: "p2", name: "성남 가을 시민문화축제", company: "성남문화재단", date: "2026-10-11",
    location: "성남시청 야외광장", status: "준비 중", careerAdded: false,
    checklist: [
      { id: "c5", label: "야외 무대 도면 확인", done: true },
      { id: "c6", label: "대중 선곡 구성", done: false },
      { id: "c7", label: "우천 대비 계획", done: false },
    ],
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL);
  const [toast, setToast] = useState<string | null>(null);

  function toggle(pid: string, cid: string) {
    setProjects((ps) => ps.map((p) => p.id === pid
      ? { ...p, checklist: p.checklist.map((c) => c.id === cid ? { ...c, done: !c.done } : c) }
      : p));
  }
  function complete(pid: string) {
    setProjects((ps) => ps.map((p) => p.id === pid ? { ...p, status: "완료" } : p));
  }
  function addCareer(pid: string) {
    setProjects((ps) => ps.map((p) => p.id === pid ? { ...p, careerAdded: true } : p));
    setToast("공개 프로필 경력에 추가되었습니다.");
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">활동 프로젝트</h1>
        <StatusBadge status="live" />
        <DemoDataBadge className="ml-1" />
      </div>
      <p className="mt-1 text-[var(--muted)]">문의 한 건을 프로젝트로 전환해 준비사항을 관리하고, 완료 후 경력에 반영합니다.</p>

      <div className="mt-6 space-y-4">
        {projects.map((p) => {
          const doneCount = p.checklist.filter((c) => c.done).length;
          const pct = Math.round((doneCount / p.checklist.length) * 100);
          return (
            <div key={p.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-[var(--muted)]">{p.company} · {p.date} · {p.location}</p>
                </div>
                <span className="rounded-md bg-[var(--surface-2)] px-2 py-0.5 text-xs font-medium">{p.status}</span>
              </div>

              {/* 진행률 */}
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-[var(--muted)]">
                  <span>준비 체크리스트</span><span>{doneCount}/{p.checklist.length} ({pct}%)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
                  <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <ul className="mt-3 space-y-1.5">
                {p.checklist.map((c) => (
                  <li key={c.id}>
                    <button onClick={() => toggle(p.id, c.id)} className="flex items-center gap-2 text-sm">
                      {c.done ? <CheckCircle2 size={18} className="text-[var(--live)]" /> : <Circle size={18} className="text-[var(--muted)]" />}
                      <span className={c.done ? "text-[var(--muted)] line-through" : ""}>{c.label}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
                {p.status !== "완료" ? (
                  <button onClick={() => complete(p.id)}
                    className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-[var(--surface-2)]">
                    활동 완료 처리
                  </button>
                ) : p.careerAdded ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--live-soft)] px-3 py-1.5 text-sm font-medium text-[var(--live)]">
                    <Trophy size={15} /> 경력에 추가됨
                  </span>
                ) : (
                  <div className="w-full rounded-lg bg-[var(--accent-soft)] p-3">
                    <p className="text-sm">이번 활동을 프로필 경력에 추가하시겠습니까?</p>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => addCareer(p.id)} className="btn-primary rounded-lg px-3 py-1.5 text-sm font-semibold">
                        경력에 추가
                      </button>
                      <button className="rounded-lg border bg-[var(--surface)] px-3 py-1.5 text-sm font-medium">나중에</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)] shadow-lg md:bottom-8">
          {toast}
        </div>
      )}
    </div>
  );
}
