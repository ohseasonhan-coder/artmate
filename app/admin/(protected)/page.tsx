import Link from "next/link";
import { Users, FileCheck, MessageSquare, Flag, LayoutTemplate, BarChart3, ArrowRight } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

const STATS = [
  { label: "가입 사용자", value: "3", href: "/admin/users" },
  { label: "검토 대기 프로필", value: "1", href: "/admin/profiles" },
  { label: "전체 기업 문의", value: "3", href: "/admin/inquiries" },
  { label: "미처리 신고", value: "0", href: "/admin/reports" },
];

const SHORTCUTS = [
  { icon: LayoutTemplate, title: "페이지 빌더", desc: "홈 구성·광고 배너 관리", href: "/admin/builder", badge: "demo" as const },
  { icon: FileCheck, title: "프로필 검토·승인", desc: "AI 결과 수정 후 공개 승인", href: "/admin/profiles", badge: "demo" as const },
  { icon: MessageSquare, title: "기업 문의 관리", desc: "전체 문의 상태 관리", href: "/admin/inquiries", badge: "demo" as const },
  { icon: BarChart3, title: "기능 관심도", desc: "구현 중 기능 수요 분석", href: "/admin/interests", badge: "demo" as const },
  { icon: Users, title: "사용자 목록", desc: "회원·권한 관리", href: "/admin/users", badge: "demo" as const },
  { icon: Flag, title: "콘텐츠 신고", desc: "신고 접수·처리", href: "/admin/reports", badge: "soon" as const },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">운영 대시보드</h1>
        <StatusBadge status="demo" />
      </div>
      <p className="mt-1 text-[var(--muted)]">사용자·프로필·문의·페이지 구성을 한곳에서 관리합니다.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <Link key={s.label} href={s.href} className="card p-4 transition hover:border-[var(--accent)]/40">
            <p className="text-xs text-[var(--muted)]">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SHORTCUTS.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.href} href={s.href} className="card group p-5 transition hover:border-[var(--accent)]/40">
              <div className="mb-3 flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon size={20} /></span>
                <StatusBadge status={s.badge} />
              </div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{s.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
                열기 <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
