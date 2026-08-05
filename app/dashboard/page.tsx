import Link from "next/link";
import { CalendarDays, MessageSquare, ClipboardCheck, AlarmClock, Trophy, Repeat } from "lucide-react";
import { DEMO_INQUIRIES, DEMO_SCHEDULES } from "@/lib/demo-data";
import StatusBadge, { DemoDataBadge } from "@/components/StatusBadge";

export const metadata = { title: "대시보드 · 아트메이트 AI" };

export default function DashboardHome() {
  const today = DEMO_SCHEDULES.slice(0, 3);
  const needReply = DEMO_INQUIRIES.filter((i) => i.status === "신규 문의" || i.status === "협의 중");

  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">안녕하세요 👋</h1>
      </div>
      <p className="mt-1 text-[var(--muted)]">오늘의 활동 요약입니다.</p>

      {/* AI 개인비서 요약 카드 */}
      <div className="mt-6 card overflow-hidden">
        <div className="flex items-center justify-between border-b bg-[var(--accent-soft)] px-5 py-3">
          <div className="flex items-center gap-2 font-semibold text-[var(--accent)]">
            ✨ AI 개인비서 브리핑
          </div>
          <StatusBadge status="demo" />
        </div>
        <div className="grid gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
          <Brief icon={CalendarDays} title="오늘·이번 주 일정" value={`${DEMO_SCHEDULES.length}건`} href="/dashboard/schedule" />
          <Brief icon={MessageSquare} title="답변이 필요한 문의" value={`${needReply.length}건`} href="/dashboard/inquiries" />
          <Brief icon={ClipboardCheck} title="준비할 사항" value="4건" href="/dashboard/projects" />
          <Brief icon={AlarmClock} title="마감 임박" value="1건" href="/dashboard/grants" />
          <Brief icon={Trophy} title="경력 추가 후보" value="2건" href="/dashboard/projects" />
          <Brief icon={Repeat} title="기업 재접촉 추천" value="3곳" href="/dashboard/inquiries" />
        </div>
      </div>

      {/* AI 비서 입력창 (데모) */}
      <Link href="/dashboard/assistant" className="mt-4 flex items-center justify-between rounded-xl border bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)] transition hover:border-[var(--accent)]/40">
        <span>&ldquo;다음 주 일정을 정리해줘&rdquo; 처럼 물어보세요…</span>
        <span className="rounded-lg bg-[var(--accent)] px-3 py-1 text-xs font-medium text-[var(--accent-fg)]">AI 비서 열기</span>
      </Link>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* 이번 주 일정 */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">다가오는 일정</h2>
            <DemoDataBadge />
          </div>
          <div className="space-y-2">
            {today.map((s) => (
              <div key={s.id} className="card flex items-center justify-between p-3">
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm text-[var(--muted)]">{s.type}{s.location ? ` · ${s.location}` : ""}</p>
                </div>
                <span className="text-sm text-[var(--muted)]">{s.date}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 답변 필요 문의 */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">답변이 필요한 문의</h2>
            <DemoDataBadge />
          </div>
          <div className="space-y-2">
            {needReply.map((i) => (
              <Link key={i.id} href="/dashboard/inquiries" className="card block p-3 transition hover:border-[var(--accent)]/40">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{i.companyName}</p>
                  <span className="rounded-md bg-[var(--surface-2)] px-2 py-0.5 text-xs">{i.status}</span>
                </div>
                <p className="text-sm text-[var(--muted)]">{i.eventName} · {i.eventDate}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Brief({ icon: Icon, title, value, href }: { icon: React.ElementType; title: string; value: string; href: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 bg-[var(--surface)] p-4 transition hover:bg-[var(--surface-2)]">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
        <Icon size={18} />
      </span>
      <div>
        <p className="text-sm text-[var(--muted)]">{title}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </Link>
  );
}
