import Link from "next/link";
import { Upload, Sparkles, ImageIcon, Eye, ArrowRight } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

export const metadata = { title: "온보딩 · 아트메이트 AI" };

const STEPS = [
  { icon: Upload, title: "자료 등록", desc: "프로필 PDF·사진·YouTube 링크를 한 번만 올립니다.", badge: "live" as const },
  { icon: Sparkles, title: "AI 분석", desc: "AI가 소개문·강점·경력 요약을 정리합니다.", badge: "demo" as const },
  { icon: ImageIcon, title: "대표 선택", desc: "대표 사진과 대표 경력을 고릅니다.", badge: "live" as const },
  { icon: Eye, title: "공개 프로필 완성", desc: "공유 링크를 받아 기업에 바로 보냅니다.", badge: "live" as const },
];

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/20 bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
          <Sparkles size={13} /> 프로필 만들기 시작
        </span>
        <h1 className="mt-4 text-2xl font-bold md:text-3xl">4단계면 전문 프로필이 완성됩니다</h1>
        <p className="mt-2 text-[var(--muted)]">자료를 한 번만 등록하면 나머지는 아트메이트가 정리해 드립니다.</p>
      </div>

      <ol className="mt-10 space-y-3">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <li key={s.title} className="card flex items-center gap-4 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--accent-soft)] font-bold text-[var(--accent)]">
                {i + 1}
              </span>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[var(--surface-2)] text-[var(--foreground)]">
                <Icon size={18} />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{s.title}</h3>
                  <StatusBadge status={s.badge} />
                </div>
                <p className="text-sm text-[var(--muted)]">{s.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex justify-center gap-3">
        <Link href="/onboarding/upload" className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-6 py-3 text-sm font-semibold">
          자료 등록 시작 <ArrowRight size={16} />
        </Link>
        <Link href="/a/crossover-ensemble" className="rounded-xl border bg-[var(--surface)] px-6 py-3 text-sm font-semibold hover:bg-[var(--surface-2)]">
          완성 예시 먼저 보기
        </Link>
      </div>
    </div>
  );
}
