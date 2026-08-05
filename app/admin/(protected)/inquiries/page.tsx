import { DEMO_INQUIRIES, getDemoArtist } from "@/lib/demo-data";
import StatusBadge, { DemoDataBadge } from "@/components/StatusBadge";

export default function AdminInquiriesPage() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">기업 문의 관리</h1>
        <StatusBadge status="demo" />
        <DemoDataBadge className="ml-1" />
      </div>
      <p className="mt-1 text-[var(--muted)]">전체 예술인에게 접수된 섭외 문의를 모아 봅니다.</p>

      <div className="mt-6 space-y-3">
        {DEMO_INQUIRIES.map((i) => (
          <div key={i.id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{i.companyName} <span className="font-normal text-[var(--muted)]">→ {getDemoArtist(i.artistSlug)?.artistName}</span></p>
                <p className="text-sm text-[var(--muted)]">{i.eventName} · {i.eventDate} · {i.location}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">담당: {i.contactName} · {i.contactEmail}</p>
              </div>
              <span className="rounded-md bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]">{i.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
