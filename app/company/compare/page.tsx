import Link from "next/link";
import { Check } from "lucide-react";
import { DEMO_ARTISTS } from "@/lib/demo-data";
import Cover from "@/components/Cover";
import StatusBadge from "@/components/StatusBadge";
import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "후보 비교 · 아트메이트 AI" };

const ROWS: { label: string; get: (a: (typeof DEMO_ARTISTS)[number]) => string }[] = [
  { label: "카테고리", get: (a) => a.mainCategory },
  { label: "구성", get: (a) => `${a.profileType} ${a.teamSize}인` },
  { label: "활동 지역", get: (a) => a.availableRegions.join(", ") },
  { label: "공연 가능시간", get: (a) => `~${a.durationMin}분` },
  { label: "대표 경력", get: (a) => `${a.careers.length}건` },
  { label: "대표 강점", get: (a) => a.strengths[0] },
];

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">후보 비교</h1>
            <StatusBadge status="soon" />
          </div>
          <p className="mt-1 text-[var(--muted)]">관심 있는 예술인을 나란히 비교합니다. (데모 데이터)</p>
        </div>
        <ComingSoon featureKey="compare" title="후보 비교·인재풀" status="soon"
          note="여러 후보를 나란히 비교하고 사내 검토보고서로 내보내는 기능은 현재 구현 중입니다."
          triggerLabel="이 기능에 관심 등록" />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="w-32" />
              {DEMO_ARTISTS.map((a) => (
                <th key={a.slug} className="p-3 align-bottom">
                  <Link href={`/a/${a.slug}`} className="block">
                    <Cover preset={a.coverImage} className="mb-2 h-24 w-full" />
                    <span className="text-sm font-semibold">{a.artistName}</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.label}>
                <td className="border-t p-3 text-sm font-medium text-[var(--muted)]">{r.label}</td>
                {DEMO_ARTISTS.map((a) => (
                  <td key={a.slug} className="border-t p-3 text-center text-sm">{r.get(a)}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="border-t p-3 text-sm font-medium text-[var(--muted)]">문의</td>
              {DEMO_ARTISTS.map((a) => (
                <td key={a.slug} className="border-t p-3 text-center">
                  <Link href={`/a/${a.slug}/inquiry`} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-[var(--surface-2)]">
                    <Check size={13} /> 섭외 문의
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
