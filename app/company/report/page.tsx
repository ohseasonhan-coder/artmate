import Link from "next/link";
import { FileText, ThumbsUp, AlertCircle } from "lucide-react";
import { getDemoArtist } from "@/lib/demo-data";
import Cover from "@/components/Cover";
import StatusBadge from "@/components/StatusBadge";
import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "내부 검토보고서 · 아트메이트 AI" };

const a = getDemoArtist("crossover-ensemble")!;

export default function ReportPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">내부 검토보고서</h1>
            <StatusBadge status="soon" />
          </div>
          <p className="mt-1 text-[var(--muted)]">사내 공유·결재용 한 페이지 보고서를 자동 생성합니다. (미리보기)</p>
        </div>
        <ComingSoon featureKey="compare" title="내부 검토보고서" status="soon"
          note="예술인 검토보고서를 PDF로 자동 생성·내보내는 기능은 현재 구현 중입니다." triggerLabel="이 기능에 관심 등록" />
      </div>

      {/* 보고서 카드 */}
      <div className="mt-6 card overflow-hidden">
        <div className="flex items-center gap-2 border-b bg-[var(--surface-2)] px-5 py-3 text-sm font-semibold">
          <FileText size={16} /> 섭외 검토보고서 — {a.artistName}
        </div>
        <div className="p-5">
          <div className="flex gap-4">
            <Cover preset={a.coverImage} className="h-24 w-24 shrink-0" />
            <div>
              <h2 className="font-bold">{a.artistName}</h2>
              <p className="text-sm text-[var(--muted)]">{a.mainCategory} · {a.profileType} {a.teamSize}인 · {a.availableRegions.join(", ")}</p>
              <p className="mt-1 text-sm">{a.introShort}</p>
            </div>
          </div>

          <Block icon={ThumbsUp} title="추천 사유" tone="live">
            <ul className="list-inside list-disc space-y-1 text-sm">
              {a.strengths.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </Block>

          <Block icon={FileText} title="대표 경력" tone="accent">
            <ul className="list-inside list-disc space-y-1 text-sm">
              {a.careers.filter((c) => c.isFeatured).map((c) => <li key={c.title}>{c.title} ({c.activityDate})</li>)}
            </ul>
          </Block>

          <Block icon={AlertCircle} title="검토 참고" tone="demo">
            <p className="text-sm">공연 가능시간 최대 {a.durationMin}분. 예산·세부 구성은 섭외 문의를 통해 협의가 필요합니다.</p>
          </Block>

          <div className="mt-5 flex gap-2 border-t pt-4">
            <Link href={`/a/${a.slug}`} className="rounded-lg border bg-[var(--surface)] px-4 py-2 text-sm font-medium hover:bg-[var(--surface-2)]">프로필 보기</Link>
            <Link href={`/a/${a.slug}/inquiry`} className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold">섭외 문의</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Block({ icon: Icon, title, tone, children }: { icon: React.ElementType; title: string; tone: "live" | "accent" | "demo"; children: React.ReactNode }) {
  const color = tone === "live" ? "text-[var(--live)]" : tone === "demo" ? "text-[var(--demo)]" : "text-[var(--accent)]";
  return (
    <div className="mt-5">
      <div className={`mb-2 flex items-center gap-1.5 text-sm font-semibold ${color}`}>
        <Icon size={15} /> {title}
      </div>
      {children}
    </div>
  );
}
