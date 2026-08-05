import { DEMO_ARTISTS, DEMO_INQUIRIES, DEMO_SCHEDULES } from "@/lib/demo-data";
import StatusBadge, { DemoDataBadge } from "@/components/StatusBadge";

export default function SamplesPage() {
  const groups = [
    { title: "샘플 예술인", items: DEMO_ARTISTS.map((a) => `${a.artistName} (${a.mainCategory})`) },
    { title: "샘플 기업 문의", items: DEMO_INQUIRIES.map((i) => `${i.companyName} · ${i.eventName}`) },
    { title: "샘플 일정", items: DEMO_SCHEDULES.map((s) => `${s.date} ${s.title} (${s.type})`) },
  ];

  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">샘플 데이터 관리</h1>
        <StatusBadge status="demo" />
        <DemoDataBadge className="ml-1" />
      </div>
      <p className="mt-1 text-[var(--muted)]">데모 모드에서 빈 화면 대신 보여줄 샘플 데이터입니다. (읽기 전용 미리보기)</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {groups.map((g) => (
          <div key={g.title} className="card p-4">
            <h2 className="mb-3 font-semibold">{g.title} <span className="text-sm font-normal text-[var(--muted)]">({g.items.length})</span></h2>
            <ul className="space-y-2 text-sm">
              {g.items.map((it, i) => (
                <li key={i} className="rounded-lg bg-[var(--surface-2)] px-3 py-2 text-[var(--muted)]">{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-lg bg-[var(--surface-2)] p-3 text-xs text-[var(--muted)]">
        Supabase 연결 시 실제 데이터로 대체되며, 샘플 데이터 삽입/초기화 기능은 구현 중입니다.
      </p>
    </div>
  );
}
