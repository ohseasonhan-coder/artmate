"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, LayoutDashboard, CalendarDays, Sparkles } from "lucide-react";

const TOP_LINKS = [
  { href: "/features", label: "기능 전체보기" },
  { href: "/roadmap", label: "구현 로드맵" },
  { href: "/browse", label: "예술인 둘러보기" },
];

const BOTTOM_LINKS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/browse", label: "둘러보기", icon: Search },
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/dashboard/schedule", label: "일정", icon: CalendarDays },
  { href: "/dashboard/assistant", label: "AI비서", icon: Sparkles },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <>
      {/* 상단 내비게이션 */}
      <header className="sticky top-0 z-40 border-b bg-[var(--surface)]/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-sm text-white">
              A
            </span>
            아트메이트 <span className="text-[var(--accent)]">AI</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {TOP_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-1.5 text-sm transition hover:bg-[var(--surface-2)] ${
                  pathname === l.href ? "font-semibold text-[var(--accent)]" : "text-[var(--muted)]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-1.5 text-sm text-[var(--muted)] hover:bg-[var(--surface-2)] sm:block"
            >
              로그인
            </Link>
            <Link
              href="/join"
              className="btn-primary rounded-lg px-3 py-1.5 text-sm font-medium"
            >
              시작하기
            </Link>
          </div>
        </div>
      </header>

      {/* 모바일 하단 내비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t bg-[var(--surface)]/95 backdrop-blur md:hidden">
        {BOTTOM_LINKS.map((l) => {
          const active = pathname === l.href;
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex flex-col items-center gap-0.5 py-2 text-[11px] ${
                active ? "text-[var(--accent)]" : "text-[var(--muted)]"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
