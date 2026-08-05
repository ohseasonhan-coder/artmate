import Link from "next/link";
import { FolderHeart } from "lucide-react";
import { DEMO_ARTISTS } from "@/lib/demo-data";
import ArtistCard from "@/components/ArtistCard";
import StatusBadge from "@/components/StatusBadge";
import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "기업 인재풀 · 아트메이트 AI" };

const FOLDERS = ["연말 송년회 후보", "창립기념 행사", "가족행사"];

export default function PoolPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">기업 인재풀</h1>
            <StatusBadge status="soon" />
          </div>
          <p className="mt-1 text-[var(--muted)]">관심 예술인을 폴더로 저장해 두고 행사마다 꺼내 씁니다. (데모 데이터)</p>
        </div>
        <ComingSoon featureKey="compare" title="기업 인재풀" status="soon"
          note="예술인을 폴더로 저장·관리하는 인재풀 기능은 현재 구현 중입니다." triggerLabel="이 기능에 관심 등록" />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {FOLDERS.map((f, i) => (
          <span key={f} className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium ${i === 0 ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]" : ""}`}>
            <FolderHeart size={14} /> {f}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_ARTISTS.map((a) => <ArtistCard key={a.slug} artist={a} />)}
      </div>

      <div className="mt-6 rounded-xl border p-4 text-sm text-[var(--muted)]">
        후보들을 나란히 보려면 <Link href="/company/compare" className="font-medium text-[var(--accent)]">후보 비교</Link>로, 내부 공유용 자료는 <Link href="/company/report" className="font-medium text-[var(--accent)]">내부 검토보고서</Link>에서 확인하세요.
      </div>
    </div>
  );
}
