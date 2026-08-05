"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { isDemoMode } from "@/lib/config";
import StatusBadge from "@/components/StatusBadge";

const CATEGORIES = ["가수", "밴드", "연주자", "연주팀", "국악팀", "댄스팀", "MC", "마술사", "퍼포먼스팀", "소규모 앙상블"];
const REGIONS = ["서울", "경기·인천", "강원", "충청", "전라", "경상", "제주", "전국"];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "", password: "", artistName: "", profileType: "개인", category: CATEGORIES[0], region: REGIONS[0],
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { artist_name: form.artistName, profile_type: form.profileType } },
      });
      setLoading(false);
      if (error) return setMsg("가입 처리 중 오류: " + error.message);
      router.push("/dashboard");
      return;
    }
    // 데모 모드: 실제 계정 생성 없이 대시보드로 이동
    setLoading(false);
    setMsg("demo");
    setTimeout(() => router.push("/dashboard"), 900);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="mb-2 flex items-center gap-2">
        <h1 className="text-2xl font-bold">문화예술인 회원가입</h1>
        <StatusBadge status={isDemoMode ? "demo" : "live"} />
      </div>
      <p className="mb-6 text-sm text-[var(--muted)]">
        {isDemoMode
          ? "데모 모드입니다. 입력값은 저장되지 않으며, 가입 후 대시보드를 체험할 수 있습니다."
          : "이메일로 가입 후 프로필을 만들 수 있습니다."}
      </p>

      <form onSubmit={onSubmit} className="card space-y-4 p-5">
        <Field label="이메일">
          <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
            className="input" placeholder="you@example.com" />
        </Field>
        <Field label="비밀번호">
          <input required type="password" minLength={6} value={form.password} onChange={(e) => set("password", e.target.value)}
            className="input" placeholder="6자 이상" />
        </Field>
        <Field label="활동명">
          <input required value={form.artistName} onChange={(e) => set("artistName", e.target.value)}
            className="input" placeholder="예: 미드나잇 재즈 트리오" />
        </Field>
        <Field label="개인 · 팀 구분">
          <div className="flex gap-2">
            {["개인", "팀"].map((t) => (
              <button type="button" key={t} onClick={() => set("profileType", t)}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium ${form.profileType === t ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]" : ""}`}>
                {t}
              </button>
            ))}
          </div>
        </Field>
        <Field label="대표 카테고리">
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="활동 지역">
          <select value={form.region} onChange={(e) => set("region", e.target.value)} className="input">
            {REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>

        {msg === "demo" && (
          <p className="rounded-lg bg-[var(--live-soft)] p-3 text-sm text-[var(--live)]">
            데모 가입 완료! 대시보드로 이동합니다…
          </p>
        )}
        {msg && msg !== "demo" && (
          <p className="rounded-lg bg-[var(--demo-soft)] p-3 text-sm text-[var(--demo)]">{msg}</p>
        )}

        <button disabled={loading} className="btn-primary w-full rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60">
          {loading ? "처리 중…" : "가입하고 프로필 만들기"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-[var(--muted)]">
        이미 계정이 있으신가요? <Link href="/login" className="font-medium text-[var(--accent)]">로그인</Link>
      </p>

      <style>{`.input{width:100%;border:1px solid var(--border);background:var(--surface);border-radius:.5rem;padding:.55rem .75rem;font-size:.875rem;outline:none}.input:focus{border-color:var(--accent)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
