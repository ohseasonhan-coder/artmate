import PrototypePage from "@/components/PrototypePage";

const DEALS = [
  { name: "그랜드호텔 갈라디너", total: "2,000,000원", deposit: "완납", balance: "지급 완료", due: "2025-09-25", status: "정산 완료" },
  { name: "삼성 계열사 창립기념식", total: "3,500,000원", deposit: "1,000,000원", balance: "2,500,000원", due: "2025-12-05", status: "미정산" },
];

export default function ContractsPage() {
  return (
    <PrototypePage
      featureKey="contracts"
      title="계약·권리·정산"
      status="soon"
      intro="계약금·잔금·저작권·초상권과 미정산을 한곳에서 관리합니다."
      note="계약서 분석 및 정산관리 기능은 현재 구현 중이며 법률·세무 자문을 대신하지 않습니다."
    >
      <div className="space-y-3">
        {DEALS.map((d) => (
          <div key={d.name} className="card p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{d.name}</p>
              <span className={`rounded-md px-2 py-1 text-xs font-medium ${d.status === "미정산" ? "bg-[var(--demo-soft)] text-[var(--demo)]" : "bg-[var(--live-soft)] text-[var(--live)]"}`}>{d.status}</span>
            </div>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-4">
              <Cell label="계약금액" value={d.total} />
              <Cell label="계약금" value={d.deposit} />
              <Cell label="잔금" value={d.balance} />
              <Cell label="지급예정일" value={d.due} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
              {["저작권", "초상권 사용기간", "촬영·홍보 사용범위"].map((t) => (
                <span key={t} className="rounded border px-2 py-1">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PrototypePage>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[var(--surface-2)] p-2.5">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}
