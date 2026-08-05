import PrototypePage from "@/components/PrototypePage";
import Cover from "@/components/Cover";

const TEMPLATES = [
  { title: "기업행사용 PPT", preset: "indigo" },
  { title: "한 페이지 프로필", preset: "plum" },
  { title: "공연 포스터", preset: "amber" },
  { title: "SNS 카드뉴스", preset: "indigo" },
  { title: "영문 프로필", preset: "plum" },
];

export default function StudioPage() {
  return (
    <PrototypePage
      featureKey="studio"
      title="제작 스튜디오"
      status="soon"
      intro="기업행사 제안용 자료를 디자인으로 골라 자동 생성합니다."
      note="현재 디자인 미리보기만 제공되며 자동 파일 생성 기능은 구현 중입니다. SNS 콘텐츠 생성·게시 연동도 함께 준비 중입니다."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <div key={t.title} className="card overflow-hidden">
            <Cover preset={t.preset} label={t.title} className="aspect-[4/3] w-full" rounded="rounded-none" />
            <div className="flex items-center justify-between p-3">
              <span className="text-sm font-medium">{t.title}</span>
              <span className="rounded-lg border px-2.5 py-1 text-xs text-[var(--muted)]">미리보기</span>
            </div>
          </div>
        ))}
      </div>
    </PrototypePage>
  );
}
