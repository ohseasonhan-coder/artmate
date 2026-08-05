import PrototypePage from "@/components/PrototypePage";

const RECORDS = [
  { name: "성남 가을 시민문화축제", date: "2025-10-11", org: "성남문화재단", role: "초청 공연", cert: "인증 대기", settle: "정산 완료" },
  { name: "그랜드호텔 갈라디너", date: "2025-09-20", org: "그랜드호텔", role: "라이브 공연", cert: "인증 완료", settle: "정산 완료" },
  { name: "삼성 계열사 창립기념식", date: "2025-11-05", org: "대기업 A", role: "메인 공연", cert: "인증 완료", settle: "미정산" },
];

export default function PassportPage() {
  return (
    <PrototypePage
      featureKey="passport"
      title="예술활동 패스포트"
      status="soon"
      intro="활동 증빙을 모아 자동으로 경력을 인증·관리합니다."
      note="예술활동 증빙과 자동 경력관리 기능은 현재 구현 중입니다."
    >
      <div className="space-y-3">
        {RECORDS.map((r) => (
          <div key={r.name} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-[var(--muted)]">{r.date} · {r.org} · {r.role}</p>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="rounded-md bg-[var(--accent-soft)] px-2 py-1 text-[var(--accent)]">{r.cert}</span>
                <span className="rounded-md bg-[var(--surface-2)] px-2 py-1">{r.settle}</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
              {["포스터", "사진", "영상", "기업 후기"].map((t) => (
                <span key={t} className="rounded border px-2 py-1">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PrototypePage>
  );
}
