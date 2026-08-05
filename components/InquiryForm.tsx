"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { isDemoMode } from "@/lib/config";
import StatusBadge from "./StatusBadge";

const FIELDS = [
  { key: "companyName", label: "기업·기관명", required: true },
  { key: "contactName", label: "담당자", required: true },
  { key: "contactEmail", label: "이메일", required: true, type: "email" },
  { key: "contactPhone", label: "연락처", required: false },
  { key: "eventName", label: "행사명", required: true },
  { key: "eventDate", label: "행사 날짜", required: true, type: "date" },
  { key: "location", label: "장소", required: true },
  { key: "audienceSize", label: "예상 관객", required: false, placeholder: "예: 300명" },
  { key: "performanceDuration", label: "희망 공연시간", required: false, placeholder: "예: 40분" },
  { key: "estimatedBudget", label: "예상 예산", required: false, placeholder: "예: 협의 / 확정" },
] as const;

type Key = (typeof FIELDS)[number]["key"] | "requestDetails";

export default function InquiryForm({ artistSlug, artistName }: { artistSlug: string; artistName: string }) {
  const [form, setForm] = useState<Record<Key, string>>(
    Object.fromEntries([...FIELDS.map((f) => [f.key, ""]), ["requestDetails", ""]]) as Record<Key, string>,
  );
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [note, setNote] = useState("");

  function set(k: Key, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from("inquiries").insert({
        artist_slug: artistSlug,
        company_name: form.companyName,
        contact_name: form.contactName,
        contact_email: form.contactEmail,
        contact_phone: form.contactPhone,
        event_name: form.eventName,
        event_date: form.eventDate || null,
        location: form.location,
        audience_size: form.audienceSize,
        performance_duration: form.performanceDuration,
        estimated_budget: form.estimatedBudget,
        request_details: form.requestDetails,
        status: "신규 문의",
      });
      if (error) {
        setNote("저장 중 오류가 발생했습니다: " + error.message);
        setState("idle");
        return;
      }
    }
    // 데모 모드에서는 저장 없이 성공 화면 표시
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="card p-8 text-center">
        <CheckCircle2 size={44} className="mx-auto text-[var(--live)]" />
        <h2 className="mt-3 text-xl font-bold">문의가 접수되었습니다</h2>
        <p className="mt-2 text-[var(--muted)]">
          <b>{artistName}</b> 팀에게 문의가 전달되었습니다. 담당자가 확인 후 입력하신 이메일로 회신드립니다.
        </p>
        {isDemoMode && (
          <p className="mx-auto mt-4 max-w-md rounded-lg bg-[var(--demo-soft)] p-3 text-sm text-[var(--demo)]">
            데모 모드에서는 실제로 저장·발송되지 않습니다. 실제 서비스에서는 문의가 예술인 대시보드의 &ldquo;문의 관리&rdquo;에 등록됩니다.
          </p>
        )}
        <div className="mt-6 flex justify-center gap-2">
          <Link href={`/a/${artistSlug}`} className="rounded-lg border bg-[var(--surface)] px-4 py-2 text-sm font-medium hover:bg-[var(--surface-2)]">
            프로필로 돌아가기
          </Link>
          <Link href="/dashboard/inquiries" className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">
            문의가 어떻게 관리되는지 보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-5 md:p-6">
      <div className="flex items-center gap-2">
        <h2 className="font-bold">섭외 문의</h2>
        <StatusBadge status="live" />
      </div>
      <p className="text-sm text-[var(--muted)]">기업·기관은 회원가입 없이 문의할 수 있습니다.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <label key={f.key} className={f.key === "eventName" ? "sm:col-span-2" : ""}>
            <span className="mb-1.5 block text-sm font-medium">
              {f.label}{f.required && <span className="text-[var(--accent)]"> *</span>}
            </span>
            <input
              required={f.required}
              type={"type" in f ? f.type : "text"}
              placeholder={"placeholder" in f ? f.placeholder : ""}
              value={form[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
              className="w-full rounded-lg border bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
          </label>
        ))}
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">요청사항</span>
        <textarea rows={4} value={form.requestDetails} onChange={(e) => set("requestDetails", e.target.value)}
          placeholder="행사 성격, 원하는 분위기, 특별 요청 등을 자유롭게 적어주세요."
          className="w-full rounded-lg border bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]" />
      </label>

      {note && <p className="rounded-lg bg-[var(--demo-soft)] p-3 text-sm text-[var(--demo)]">{note}</p>}

      <button disabled={state === "loading"} className="btn-primary w-full rounded-lg py-3 text-sm font-semibold disabled:opacity-60">
        {state === "loading" ? "전송 중…" : "섭외 문의 보내기"}
      </button>
      <p className="text-center text-xs text-[var(--muted)]">
        전화번호는 예술인에게만 공개되며, 문의 폼을 통해서만 연락이 이뤄집니다.
      </p>
    </form>
  );
}
