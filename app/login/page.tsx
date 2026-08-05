"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { isDemoMode } from "@/lib/config";
import StatusBadge from "@/components/StatusBadge";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setMsg("로그인 오류: " + error.message);
      router.push("/dashboard");
      return;
    }
    setLoading(false);
    router.push("/dashboard"); // 데모 모드: 바로 대시보드 체험
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="mb-2 flex items-center gap-2">
        <h1 className="text-2xl font-bold">로그인</h1>
        <StatusBadge status={isDemoMode ? "demo" : "live"} />
      </div>
      <p className="mb-6 text-sm text-[var(--muted)]">
        {isDemoMode
          ? "데모 모드에서는 아무 값이나 입력하면 대시보드를 체험할 수 있습니다."
          : "가입한 이메일로 로그인하세요."}
      </p>
      <form onSubmit={onSubmit} className="card space-y-4 p-5">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일" className="w-full rounded-lg border bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]" />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호" className="w-full rounded-lg border bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]" />
        {msg && <p className="rounded-lg bg-[var(--demo-soft)] p-3 text-sm text-[var(--demo)]">{msg}</p>}
        <button disabled={loading} className="btn-primary w-full rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60">
          {loading ? "처리 중…" : "로그인"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-[var(--muted)]">
        계정이 없으신가요? <Link href="/signup" className="font-medium text-[var(--accent)]">회원가입</Link>
      </p>
    </div>
  );
}
