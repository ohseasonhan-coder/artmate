"use client";

import { useState, type ReactNode } from "react";
import { registerInterest, type InterestType } from "@/lib/interests";
import { STATUS_META } from "@/lib/features";
import type { FeatureStatus } from "@/lib/types";
import StatusBadge from "./StatusBadge";

const INTEREST_BUTTONS: InterestType[] = ["필요해요", "출시 알림", "우선 개발"];

/**
 * 구현 중/데모 기능용 인터랙션.
 * 버튼을 누르면 안내·미리보기·관심등록이 담긴 모달을 연다.
 * (프롬프트: 구현되지 않은 버튼을 아무 반응 없이 두지 않는다.)
 */
export default function ComingSoon({
  featureKey,
  title,
  status = "soon",
  note,
  preview,
  triggerLabel = "기능 미리보기",
  triggerClassName,
}: {
  featureKey: string;
  title: string;
  status?: FeatureStatus;
  note?: string;
  preview?: ReactNode;
  triggerLabel?: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const guidance = note ?? STATUS_META[status].note;

  async function handle(type: InterestType, text?: string) {
    await registerInterest(featureKey, type, text);
    setDone(type === "의견" ? "의견이 접수되었습니다. 감사합니다!" : "관심이 등록되었습니다. 감사합니다!");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          triggerClassName ??
          "inline-flex items-center gap-2 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--accent)] transition hover:brightness-105"
        }
      >
        {triggerLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="card w-full max-w-lg overflow-hidden rounded-b-none rounded-t-2xl shadow-xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b p-5">
              <div>
                <div className="mb-1.5">
                  <StatusBadge status={status} />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-[var(--muted)] hover:bg-[var(--surface-2)]"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-5">
              <p className="mb-4 rounded-lg bg-[var(--surface-2)] p-3 text-sm text-[var(--muted)]">
                {guidance}
              </p>

              {preview && <div className="mb-5">{preview}</div>}

              {done ? (
                <div className="rounded-lg border border-[var(--live)]/25 bg-[var(--live-soft)] p-4 text-center text-sm font-medium text-[var(--live)]">
                  {done}
                </div>
              ) : (
                <div>
                  <p className="mb-2 text-sm font-medium">이 기능에 관심이 있으신가요?</p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {INTEREST_BUTTONS.map((t) => (
                      <button
                        key={t}
                        onClick={() => handle(t)}
                        className="rounded-lg border px-3 py-1.5 text-sm font-medium transition hover:bg-[var(--surface-2)]"
                      >
                        {t === "출시 알림" ? "출시 알림 받기" : t === "우선 개발" ? "우선 개발 요청" : "이 기능이 필요해요"}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="의견을 남겨주세요 (선택)"
                      className="flex-1 rounded-lg border bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                    />
                    <button
                      onClick={() => comment.trim() && handle("의견", comment.trim())}
                      className="btn-primary rounded-lg px-3 py-2 text-sm font-medium"
                    >
                      의견 남기기
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t p-4 text-right">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--muted)] hover:bg-[var(--surface-2)]"
              >
                돌아가기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
