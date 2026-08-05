import { Star } from "lucide-react";
import StatusBadge, { DemoDataBadge } from "@/components/StatusBadge";

const FEEDBACK = [
  { page: "공개 프로필", rating: 5, comment: "프로필이 깔끔해서 기업에 바로 공유했어요.", date: "2026-07-30" },
  { page: "문의 관리", rating: 4, comment: "상태 단계가 직관적입니다. 알림도 있으면 좋겠어요.", date: "2026-07-25" },
  { page: "AI 개인비서", rating: 4, comment: "데모지만 방향성이 좋네요. 실제 연동 기대됩니다.", date: "2026-07-22" },
];

export default function FeedbackPage() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">사용자 피드백</h1>
        <StatusBadge status="demo" />
        <DemoDataBadge className="ml-1" />
      </div>
      <p className="mt-1 text-[var(--muted)]">화면별 평점과 의견을 모아 개선 우선순위를 정합니다.</p>

      <div className="mt-6 space-y-3">
        {FEEDBACK.map((f, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-[var(--surface-2)] px-2 py-0.5 text-xs font-medium">{f.page}</span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} size={14} className={k < f.rating ? "fill-amber-400 text-amber-400" : "text-[var(--border)]"} />
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm">{f.comment}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">{f.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
