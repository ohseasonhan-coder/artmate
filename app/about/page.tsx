import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "서비스 소개 · 아트메이트 AI" };

const FLOW = [
  { step: "자료 등록", desc: "프로필·사진·영상·이력서를 한 번만 등록" },
  { step: "AI 프로필 생성", desc: "AI 또는 관리자가 전문 공개 프로필로 정리" },
  { step: "공개 링크 공유", desc: "기업·기관에 프로필 링크 전달" },
  { step: "기업 섭외 문의", desc: "가입 없이 문의 접수" },
  { step: "일정·활동 프로젝트", desc: "문의를 프로젝트로 전환, 준비사항 관리" },
  { step: "활동 완료 → 경력 업데이트", desc: "완료한 활동을 경력·포트폴리오에 반영" },
];

const AUDIENCE = {
  artist: ["가수", "밴드", "연주자·연주팀", "국악팀", "댄스팀", "MC", "마술사", "퍼포먼스팀", "소규모 앙상블"],
  company: ["일반기업", "행사기획사", "공공기관·지자체", "문화재단", "학교", "호텔", "행사시설"],
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">아트메이트 AI 소개</h1>
      <p className="mt-3 text-lg text-[var(--muted)]">
        문화예술인을 위한 AI 프로필·섭외·일정관리 서비스입니다. 자료를 한 번 등록하면
        전문 프로필을 만들고, 기업 섭외부터 일정과 경력까지 한곳에서 관리합니다.
      </p>

      <h2 className="mt-10 text-xl font-bold">핵심 서비스 흐름</h2>
      <ol className="mt-4 space-y-3">
        {FLOW.map((f, i) => (
          <li key={f.step} className="card flex items-start gap-3 p-4">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-sm font-bold text-[var(--accent)]">{i + 1}</span>
            <div>
              <p className="font-semibold">{f.step}</p>
              <p className="text-sm text-[var(--muted)]">{f.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mt-10 text-xl font-bold">누구를 위한 서비스인가요</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-semibold">문화예술인</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {AUDIENCE.artist.map((t) => <span key={t} className="rounded-lg bg-[var(--surface-2)] px-2.5 py-1 text-xs">{t}</span>)}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold">기업·기관</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {AUDIENCE.company.map((t) => <span key={t} className="rounded-lg bg-[var(--surface-2)] px-2.5 py-1 text-xs">{t}</span>)}
          </div>
        </div>
      </div>

      <div className="mt-10 card flex flex-col items-center gap-3 bg-gradient-to-br from-[var(--accent-soft)] to-[var(--surface)] p-8 text-center">
        <h2 className="text-xl font-bold">지금 무료로 시작해 보세요</h2>
        <div className="flex gap-2">
          <Link href="/onboarding" className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-5 py-3 text-sm font-semibold">
            프로필 만들기 <ArrowRight size={16} />
          </Link>
          <Link href="/features" className="rounded-xl border bg-[var(--surface)] px-5 py-3 text-sm font-semibold hover:bg-[var(--surface-2)]">기능 전체보기</Link>
        </div>
      </div>
    </div>
  );
}
