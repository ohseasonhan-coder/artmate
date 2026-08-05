import Link from "next/link";

const COLS = [
  { title: "서비스", links: [["서비스 소개", "/about"], ["기능 전체보기", "/features"], ["구현 로드맵", "/roadmap"]] },
  { title: "문화예술인", links: [["프로필 만들기", "/onboarding"], ["대시보드", "/dashboard"], ["AI 개인비서", "/dashboard/assistant"]] },
  { title: "기업·기관", links: [["예술인 둘러보기", "/browse"], ["자연어 AI 검색", "/company/search"], ["인재풀", "/company/pool"]] },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-[var(--surface)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-sm text-white">A</span>
            아트메이트 <span className="text-[var(--accent)]">AI</span>
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">문화예술인을 위한 AI 개인 매니저 (프로토타입 MVP)</p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h4 className="mb-3 text-sm font-semibold">{c.title}</h4>
            <ul className="space-y-2">
              {c.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t px-4 py-4 text-center text-xs text-[var(--muted)]">
        © 2026 아트메이트 AI · 프로토타입형 MVP · 데모 데이터는 실제 정보가 아닙니다.
      </div>
    </footer>
  );
}
