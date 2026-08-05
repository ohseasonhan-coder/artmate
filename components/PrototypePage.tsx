import type { ReactNode } from "react";
import { Wrench } from "lucide-react";
import StatusBadge from "./StatusBadge";
import ComingSoon from "./ComingSoon";
import type { FeatureStatus } from "@/lib/types";

/**
 * 구현 중/데모 기능 화면의 공통 껍데기.
 * 안내 문구 + 미리보기(children) + 관심 등록을 일관되게 보여준다.
 */
export default function PrototypePage({
  featureKey,
  title,
  status = "soon",
  note,
  intro,
  children,
}: {
  featureKey: string;
  title: string;
  status?: FeatureStatus;
  note: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <StatusBadge status={status} />
          </div>
          {intro && <p className="mt-1 text-[var(--muted)]">{intro}</p>}
        </div>
        <ComingSoon featureKey={featureKey} title={title} status={status} note={note} triggerLabel="이 기능에 관심 등록" />
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-[var(--soon)]/20 bg-[var(--soon-soft)] p-4 text-sm text-[var(--soon)]">
        <Wrench size={16} className="mt-0.5 shrink-0" />
        <p>{note}</p>
      </div>

      {/* 미리보기(예상 화면) */}
      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">기능 미리보기</p>
        {children}
      </div>
    </div>
  );
}
