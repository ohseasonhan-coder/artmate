"use client";

import { useState } from "react";
import { DEMO_INQUIRIES } from "@/lib/demo-data";
import type { Inquiry, InquiryStatus } from "@/lib/types";
import StatusBadge, { DemoDataBadge } from "@/components/StatusBadge";

const STATUSES: InquiryStatus[] = ["신규 문의", "일정 확인", "협의 중", "확정", "완료", "취소"];
const STATUS_COLOR: Record<InquiryStatus, string> = {
  "신규 문의": "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "일정 확인": "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  "협의 중": "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "확정": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "완료": "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300",
  "취소": "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300",
};

export default function InquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>(DEMO_INQUIRIES);
  const [open, setOpen] = useState<string | null>(null);

  function setStatus(id: string, status: InquiryStatus) {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, status } : i)));
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">문의 관리</h1>
        <StatusBadge status="live" />
        <DemoDataBadge className="ml-1" />
      </div>
      <p className="mt-1 text-[var(--muted)]">
        신규 → 일정 확인 → 협의 → 확정 → 완료 단계로 문의를 관리합니다. (데모 데이터로 상태 변경을 체험해 보세요.)
      </p>

      {/* 상태 요약 */}
      <div className="mt-5 flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const n = items.filter((i) => i.status === s).length;
          return (
            <span key={s} className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLOR[s]}`}>
              {s} {n}
            </span>
          );
        })}
      </div>

      <div className="mt-5 space-y-3">
        {items.map((i) => (
          <div key={i.id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{i.companyName}</h3>
                  <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[i.status]}`}>{i.status}</span>
                </div>
                <p className="mt-0.5 text-sm text-[var(--muted)]">
                  {i.eventName} · {i.eventDate} · {i.location}
                </p>
              </div>
              <button onClick={() => setOpen(open === i.id ? null : i.id)}
                className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-[var(--surface-2)]">
                {open === i.id ? "접기" : "상세"}
              </button>
            </div>

            {open === i.id && (
              <div className="mt-4 space-y-3 border-t pt-4 text-sm">
                <div className="grid gap-2 sm:grid-cols-2">
                  <Info label="담당자" value={`${i.contactName} · ${i.contactEmail}`} />
                  <Info label="예상 관객" value={i.audienceSize} />
                  <Info label="희망 공연시간" value={i.performanceDuration} />
                  <Info label="예상 예산" value={i.estimatedBudget} />
                </div>
                <Info label="요청사항" value={i.requestDetails} />
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-sm font-medium">상태 변경:</span>
                  {STATUSES.map((s) => (
                    <button key={s} onClick={() => setStatus(i.id, s)}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                        i.status === s ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]" : "hover:bg-[var(--surface-2)]"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
                <button className="mt-1 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-fg)]"
                  onClick={() => setStatus(i.id, "확정")}>
                  활동 프로젝트로 전환 →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <span className="text-[var(--muted)]">{label}: </span>
      <span>{value || "—"}</span>
    </div>
  );
}
