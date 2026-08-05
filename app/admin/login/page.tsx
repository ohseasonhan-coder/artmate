"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "로그인에 실패했습니다.");
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col px-4 py-20">
      <div className="mb-6 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <ShieldCheck size={24} />
        </span>
        <h1 className="mt-3 text-2xl font-bold">관리자 로그인</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">아트메이트 AI 운영 콘솔</p>
      </div>
      <form onSubmit={onSubmit} className="card space-y-4 p-5">
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="아이디" autoComplete="username"
          className="w-full rounded-lg border bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" autoComplete="current-password"
          className="w-full rounded-lg border bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]" />
        {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-950 dark:text-rose-300">{error}</p>}
        <button disabled={loading} className="btn-primary w-full rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60">
          {loading ? "확인 중…" : "로그인"}
        </button>
      </form>
    </div>
  );
}
