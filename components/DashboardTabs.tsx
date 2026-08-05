"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard", label: "홈" },
  { href: "/dashboard/inquiries", label: "문의 관리" },
  { href: "/dashboard/schedule", label: "일정" },
  { href: "/dashboard/projects", label: "활동 프로젝트" },
  { href: "/dashboard/profile", label: "프로필 편집" },
  { href: "/dashboard/media", label: "사진·영상" },
  { href: "/dashboard/assistant", label: "AI 비서" },
  { href: "/dashboard/studio", label: "제작 스튜디오" },
  { href: "/dashboard/passport", label: "패스포트" },
  { href: "/dashboard/grants", label: "지원사업" },
  { href: "/dashboard/contracts", label: "계약·정산" },
  { href: "/dashboard/team", label: "팀 관리" },
  { href: "/dashboard/integrations", label: "설정·연동" },
];

export default function DashboardTabs() {
  const pathname = usePathname();
  return (
    <div className="sticky top-14 z-30 border-b bg-[var(--background)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => {
          const active = pathname === t.href;
          return (
            <Link key={t.href} href={t.href}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                active ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)] hover:bg-[var(--surface-2)]"
              }`}>
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
