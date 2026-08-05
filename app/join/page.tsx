import Link from "next/link";
import { Mic2, Building2, ArrowRight } from "lucide-react";

export const metadata = { title: "회원 유형 선택 · 아트메이트 AI" };

export default function JoinPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-center text-2xl font-bold">어떤 목적으로 오셨나요?</h1>
      <p className="mt-2 text-center text-[var(--muted)]">유형을 선택하면 맞는 흐름으로 안내해 드립니다.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/signup" className="card group p-6 transition hover:border-[var(--accent)]/40 hover:shadow-md">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Mic2 size={24} />
          </span>
          <h2 className="mt-4 text-lg font-bold">문화예술인으로 시작</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            프로필을 만들고 섭외 문의를 받고 일정을 관리합니다.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
            무료 프로필 만들기 <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link href="/browse" className="card group p-6 transition hover:border-[var(--accent)]/40 hover:shadow-md">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--surface-2)] text-[var(--foreground)]">
            <Building2 size={24} />
          </span>
          <h2 className="mt-4 text-lg font-bold">기업·기관으로 둘러보기</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            가입 없이 예술인을 탐색하고 섭외 문의를 보낼 수 있습니다.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
            예술인 둘러보기 <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>

      <p className="mt-8 text-center text-sm text-[var(--muted)]">
        이미 계정이 있으신가요? <Link href="/login" className="font-medium text-[var(--accent)]">로그인</Link>
      </p>
    </div>
  );
}
