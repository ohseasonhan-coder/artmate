import PrototypePage from "@/components/PrototypePage";

const MEMBERS = [
  { name: "김바이올린", role: "바이올린", avail: "가능", next: "8/8 공연 참여" },
  { name: "이첼로", role: "첼로", avail: "가능", next: "8/8 공연 참여" },
  { name: "박피아노", role: "피아노 / 편곡", avail: "조율 중", next: "8/10 리허설 미정" },
  { name: "최보컬", role: "보컬 / MC", avail: "불가", next: "8/8 개인 일정" },
];

export default function TeamPage() {
  return (
    <PrototypePage
      featureKey="team"
      title="팀 일정관리"
      status="soon"
      intro="팀원 일정·참여 여부·역할·정산을 함께 관리합니다."
      note="팀 일정 및 역할관리 기능은 현재 구현 중입니다."
    >
      <div className="card divide-y">
        {MEMBERS.map((m) => (
          <div key={m.name} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent)]">
                {m.name[0]}
              </span>
              <div>
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-xs text-[var(--muted)]">{m.role} · {m.next}</p>
              </div>
            </div>
            <span className={`rounded-md px-2 py-1 text-xs font-medium ${
              m.avail === "가능" ? "bg-[var(--live-soft)] text-[var(--live)]"
              : m.avail === "불가" ? "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300"
              : "bg-[var(--demo-soft)] text-[var(--demo)]"
            }`}>{m.avail}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
        {["리허설 일정 투표", "역할 배정", "장비·차량 배정", "팀원별 정산"].map((t) => (
          <span key={t} className="rounded-lg border px-3 py-1.5">{t}</span>
        ))}
      </div>
    </PrototypePage>
  );
}
