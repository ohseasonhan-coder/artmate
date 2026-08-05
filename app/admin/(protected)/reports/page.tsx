import { Flag, ShieldCheck } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

export default function ReportsPage() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">콘텐츠 신고</h1>
        <StatusBadge status="soon" />
      </div>
      <p className="mt-1 text-[var(--muted)]">부적절한 프로필·콘텐츠 신고를 접수하고 처리합니다.</p>

      <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--live-soft)] text-[var(--live)]">
          <ShieldCheck size={24} />
        </span>
        <p className="mt-3 font-medium">현재 접수된 신고가 없습니다</p>
        <p className="mt-1 text-sm text-[var(--muted)]">신고가 접수되면 이곳에 표시됩니다.</p>
      </div>

      <div className="mt-6 flex items-start gap-2 rounded-xl border border-[var(--soon)]/20 bg-[var(--soon-soft)] p-4 text-sm text-[var(--soon)]">
        <Flag size={16} className="mt-0.5 shrink-0" />
        <p>신고 자동 분류·처리 워크플로는 현재 구현 중입니다.</p>
      </div>
    </div>
  );
}
