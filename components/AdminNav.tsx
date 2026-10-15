"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, LayoutTemplate, Megaphone, Users, FileCheck,
  MessageSquare, Flag, MessagesSquare, BarChart3, Database, LogOut, Activity,
} from "lucide-react";

const LINKS = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/status", label: "시스템 점검", icon: Activity },
  { href: "/admin/builder", label: "페이지 빌더", icon: LayoutTemplate },
  { href: "/admin/ads", label: "광고 관리", icon: Megaphone },
  { href: "/admin/users", label: "사용자 목록", icon: Users },
  { href: "/admin/profiles", label: "프로필 검토·승인", icon: FileCheck },
  { href: "/admin/inquiries", label: "기업 문의 관리", icon: MessageSquare },
  { href: "/admin/reports", label: "콘텐츠 신고", icon: Flag },
  { href: "/admin/feedback", label: "사용자 피드백", icon: MessagesSquare },
  { href: "/admin/interests", label: "기능 관심도", icon: BarChart3 },
  { href: "/admin/samples", label: "샘플 데이터", icon: Database },
];

export default function AdminNav({ username }: { username: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="md:w-60 md:shrink-0">
      {/* 데스크톱: 사이드바 / 모바일: 가로 스크롤 탭 */}
      <div className="mb-2 hidden items-center gap-2 px-2 md:flex">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">A</span>
        <div className="text-sm">
          <p className="font-semibold leading-tight">운영 콘솔</p>
          <p className="text-xs text-[var(--muted)]">{username} 님</p>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          const Icon = l.icon;
          return (
            <Link key={l.href} href={l.href}
              className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                active ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)] hover:bg-[var(--surface-2)]"
              }`}>
              <Icon size={16} /> {l.label}
            </Link>
          );
        })}
        <button onClick={logout}
          className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-950 md:mt-2">
          <LogOut size={16} /> 로그아웃
        </button>
      </nav>
    </aside>
  );
}
