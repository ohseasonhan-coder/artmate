import { DEMO_SCHEDULES } from "@/lib/demo-data";
import type { ScheduleType } from "@/lib/types";
import StatusBadge, { DemoDataBadge } from "@/components/StatusBadge";
import ComingSoon from "@/components/ComingSoon";

const TYPE_COLOR: Record<ScheduleType, string> = {
  "공연": "border-l-emerald-500",
  "리허설": "border-l-indigo-500",
  "기업 미팅": "border-l-blue-500",
  "개인 일정": "border-l-stone-400",
  "임시 섭외": "border-l-amber-500",
  "확정 섭외": "border-l-violet-500",
  "제출 마감": "border-l-rose-500",
};

export default function SchedulePage() {
  const sorted = [...DEMO_SCHEDULES].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">일정관리</h1>
            <StatusBadge status="live" />
            <DemoDataBadge className="ml-1" />
          </div>
          <p className="mt-1 text-[var(--muted)]">공연·리허설·미팅·마감을 한눈에 관리합니다.</p>
        </div>
        <ComingSoon
          featureKey="gcal"
          title="Google Calendar 양방향 연동"
          status="soon"
          note="Google Calendar 양방향 연동 기능은 현재 구현 중입니다. 정식 버전에서는 공연·리허설·미팅 일정을 자동으로 동기화합니다."
          triggerLabel="Google Calendar 연결"
        />
      </div>

      <div className="mt-6 space-y-2">
        {sorted.map((s) => (
          <div key={s.id} className={`card border-l-4 p-4 ${TYPE_COLOR[s.type]}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[var(--surface-2)] px-2 py-0.5 text-xs font-medium">{s.type}</span>
                  <span className="text-xs text-[var(--muted)]">{s.status}</span>
                </div>
                <p className="mt-1 font-medium">{s.title}</p>
                {s.location && <p className="text-sm text-[var(--muted)]">{s.location}</p>}
              </div>
              <span className="text-sm font-medium">{s.date}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 rounded-xl bg-[var(--surface-2)] p-4 text-sm text-[var(--muted)]">
        개인 일정은 기본 비공개이며, 기업에는 일정 가능 여부만 공개됩니다.
      </p>
    </div>
  );
}
