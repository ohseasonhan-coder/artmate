import Link from "next/link";
import { getDemoArtist, DEMO_INQUIRIES } from "@/lib/demo-data";
import StatusBadge, { DemoDataBadge } from "@/components/StatusBadge";

export const metadata = { title: "문의 진행상태 · 아트메이트 AI" };

const FLOW = ["신규 문의", "일정 확인", "협의 중", "확정", "완료"];

export default function CompanyInquiriesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">내 문의 진행상태</h1>
        <StatusBadge status="demo" />
        <DemoDataBadge className="ml-1" />
      </div>
      <p className="mt-1 text-[var(--muted)]">보낸 섭외 문의가 어떻게 진행되고 있는지 확인합니다.</p>

      <div className="mt-6 space-y-4">
        {DEMO_INQUIRIES.map((i) => {
          const artist = getDemoArtist(i.artistSlug);
          const activeIdx = Math.max(0, FLOW.indexOf(i.status));
          return (
            <div key={i.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Link href={`/a/${i.artistSlug}`} className="font-semibold hover:text-[var(--accent)]">
                    {artist?.artistName ?? i.artistSlug}
                  </Link>
                  <p className="text-sm text-[var(--muted)]">{i.eventName} · {i.eventDate} · {i.location}</p>
                </div>
                <span className="rounded-md bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]">{i.status}</span>
              </div>

              {/* 진행 타임라인 */}
              <div className="mt-4 flex items-center">
                {FLOW.map((s, idx) => (
                  <div key={s} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center">
                      <span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${
                        idx <= activeIdx ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "bg-[var(--surface-2)] text-[var(--muted)]"
                      }`}>{idx + 1}</span>
                      <span className={`mt-1 whitespace-nowrap text-[10px] ${idx <= activeIdx ? "font-medium" : "text-[var(--muted)]"}`}>{s}</span>
                    </div>
                    {idx < FLOW.length - 1 && (
                      <div className={`mx-1 h-0.5 flex-1 ${idx < activeIdx ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
