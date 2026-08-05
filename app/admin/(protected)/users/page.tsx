import StatusBadge, { DemoDataBadge } from "@/components/StatusBadge";

const USERS = [
  { name: "루미에르 크로스오버 앙상블", email: "ensemble@example.com", role: "artist", status: "공개", joined: "2026-06-12" },
  { name: "미드나잇 재즈 트리오", email: "jazz@example.com", role: "artist", status: "공개", joined: "2026-07-01" },
  { name: "원더 매직 퍼포먼스", email: "magic@example.com", role: "artist", status: "검토 대기", joined: "2026-07-20" },
];

export default function UsersPage() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">사용자 목록</h1>
        <StatusBadge status="demo" />
        <DemoDataBadge className="ml-1" />
      </div>
      <p className="mt-1 text-[var(--muted)]">회원 계정과 역할·상태를 관리합니다.</p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-[var(--muted)]">
              <th className="p-3">이름</th><th className="p-3">이메일</th><th className="p-3">역할</th><th className="p-3">상태</th><th className="p-3">가입일</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((u) => (
              <tr key={u.email} className="border-b">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3 text-[var(--muted)]">{u.email}</td>
                <td className="p-3"><span className="rounded-md bg-[var(--accent-soft)] px-2 py-0.5 text-xs text-[var(--accent)]">{u.role}</span></td>
                <td className="p-3">{u.status}</td>
                <td className="p-3 text-[var(--muted)]">{u.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
