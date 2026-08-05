import type { FeatureStatus } from "@/lib/types";
import { STATUS_META } from "@/lib/features";

const STYLES: Record<FeatureStatus, string> = {
  live: "text-[var(--live)] bg-[var(--live-soft)] border-[var(--live)]/25",
  demo: "text-[var(--demo)] bg-[var(--demo-soft)] border-[var(--demo)]/25",
  soon: "text-[var(--soon)] bg-[var(--soon-soft)] border-[var(--soon)]/25",
};

export default function StatusBadge({
  status,
  className = "",
}: {
  status: FeatureStatus;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${STYLES[status]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_META[status].label}
    </span>
  );
}

/** "데모 데이터" 표기용 소형 배지 */
export function DemoDataBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-[var(--demo)]/25 bg-[var(--demo-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--demo)] ${className}`}
    >
      데모 데이터
    </span>
  );
}
