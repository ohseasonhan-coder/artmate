import PrototypePage from "@/components/PrototypePage";

const GRANTS = [
  { name: "지역문화예술 특성화 지원사업", deadline: "D-12", fit: "높음", missing: "사업자등록증" },
  { name: "청년예술인 활동지원금", deadline: "D-25", fit: "보통", missing: "활동 실적 증빙" },
  { name: "공연예술 창작산실 지원", deadline: "D-40", fit: "보통", missing: "기획서 초안" },
];

export default function GrantsPage() {
  return (
    <PrototypePage
      featureKey="grants"
      title="지원사업 AI 비서"
      status="soon"
      intro="보유 자료를 바탕으로 신청 가능한 지원사업을 추천합니다."
      note="개인 맞춤 지원사업 추천 기능은 현재 구현 중입니다."
    >
      <div className="space-y-3">
        {GRANTS.map((g) => (
          <div key={g.name} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{g.name}</p>
              <span className="rounded-md bg-[var(--soon-soft)] px-2 py-1 text-xs font-medium text-[var(--soon)]">{g.deadline}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
              <span>신청 가능성: <b className="text-[var(--foreground)]">{g.fit}</b></span>
              <span>부족한 자료: <b className="text-[var(--demo)]">{g.missing}</b></span>
            </div>
            <button className="mt-3 rounded-lg border px-3 py-1.5 text-xs font-medium text-[var(--muted)]">신청서 초안 생성 (미리보기)</button>
          </div>
        ))}
      </div>
    </PrototypePage>
  );
}
