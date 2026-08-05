import { CheckCircle2, PlayCircle, Wrench } from "lucide-react";
import { FEATURES } from "@/lib/features";
import StatusBadge from "@/components/StatusBadge";

export const metadata = { title: "구현 로드맵 · 아트메이트 AI" };

const PHASES = [
  {
    key: "live" as const,
    icon: CheckCircle2,
    title: "지금 사용 가능",
    desc: "실제 데이터 저장·수정이 가능한 핵심 기능",
  },
  {
    key: "demo" as const,
    icon: PlayCircle,
    title: "데모 체험 가능",
    desc: "샘플 데이터로 사용 흐름을 미리 체험",
  },
  {
    key: "soon" as const,
    icon: Wrench,
    title: "구현 중 (프로토타입)",
    desc: "화면과 예상 동작을 확인하고 관심을 남길 수 있음",
  },
];

const FUTURE = [
  "배우·캐스팅", "미술작가", "공예작가", "문화예술 강사",
  "대형 오케스트라", "팬클럽", "티켓", "굿즈",
];

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">구현 로드맵</h1>
      <p className="mt-2 text-[var(--muted)]">
        아트메이트 AI는 핵심 흐름부터 시작해 AI 자동화·연동·매칭으로 확장합니다.
      </p>

      <div className="mt-8 space-y-8">
        {PHASES.map((phase) => {
          const items = FEATURES.filter((f) => f.status === phase.key);
          const Icon = phase.icon;
          return (
            <div key={phase.key} className="relative">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Icon size={20} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold">{phase.title}</h2>
                    <StatusBadge status={phase.key} />
                  </div>
                  <p className="text-sm text-[var(--muted)]">{phase.desc}</p>
                </div>
              </div>
              <ul className="ml-13 grid gap-2 pl-13 sm:grid-cols-2">
                {items.map((f) => (
                  <li key={f.key} className="card px-3 py-2 text-sm">
                    <span className="font-medium">{f.title}</span>
                    <span className="block text-xs text-[var(--muted)]">{f.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* 향후 확장 대상 */}
      <div className="mt-12 card p-6">
        <div className="mb-2 flex items-center gap-2">
          <h2 className="font-bold">향후 확장 대상</h2>
          <StatusBadge status="soon" />
        </div>
        <p className="text-sm text-[var(--muted)]">
          다음 분야는 메뉴와 프로토타입 화면으로 방향을 보여드리며, 초기 실제 기능 범위에서는 제외됩니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {FUTURE.map((f) => (
            <span key={f} className="rounded-lg bg-[var(--surface-2)] px-3 py-1.5 text-sm text-[var(--muted)]">
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
