import { Calendar, Mail, HardDrive } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import ComingSoon from "@/components/ComingSoon";

const INTEGRATIONS = [
  {
    key: "gcal", icon: Calendar, title: "Google Calendar",
    desc: "공연·리허설·미팅 일정을 자동으로 동기화합니다.",
    note: "Google Calendar 양방향 연동 기능은 현재 구현 중입니다. 정식 버전에서는 공연·리허설·미팅 일정을 자동으로 동기화하고 충돌 일정을 확인합니다.",
    points: ["일정 가져오기", "일정 내보내기", "충돌 일정 확인"],
  },
  {
    key: "gmail", icon: Mail, title: "Gmail",
    desc: "섭외 이메일을 감지해 활동 프로젝트로 변환합니다.",
    note: "이메일 자동분류 및 섭외 감지 기능은 현재 구현 중입니다.",
    points: ["섭외 메일 감지", "프로젝트 변환", "답장 초안 생성", "계약·정산 메일 분류"],
  },
  {
    key: "gdrive", icon: HardDrive, title: "Google Drive",
    desc: "행사별 폴더를 만들고 자료를 자동 분류합니다.",
    note: "Google Drive 자료 자동분류 기능은 현재 구현 중입니다.",
    points: ["행사별 폴더 생성", "사진·PDF 가져오기", "자료 자동분류", "기업 공유파일 관리"],
  },
];

export default function IntegrationsPage() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">설정 및 연동</h1>
        <StatusBadge status="soon" />
      </div>
      <p className="mt-1 text-[var(--muted)]">외부 서비스와 연결해 반복 작업을 자동화합니다. (실제 권한은 요구하지 않습니다.)</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {INTEGRATIONS.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.key} className="card flex flex-col p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--surface-2)]"><Icon size={20} /></span>
                <StatusBadge status="soon" />
              </div>
              <h3 className="font-semibold">{it.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{it.desc}</p>
              <ul className="mt-3 flex-1 space-y-1 text-xs text-[var(--muted)]">
                {it.points.map((p) => <li key={p}>· {p}</li>)}
              </ul>
              <div className="mt-4">
                <ComingSoon featureKey={it.key} title={`${it.title} 연동`} status="soon" note={it.note} triggerLabel={`${it.title} 연결`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 계정·개인정보 */}
      <div className="mt-8 card p-5">
        <div className="flex items-center gap-2">
          <h2 className="font-bold">계정 및 개인정보</h2>
          <StatusBadge status="live" />
        </div>
        <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
          <li>· 개인 일정과 전화번호는 기본 비공개입니다.</li>
          <li>· 모든 외부 공개는 사용자 승인 후에만 이루어집니다.</li>
          <li>· 사용자는 언제든 계정과 데이터를 삭제할 수 있습니다.</li>
        </ul>
        <button className="mt-4 rounded-lg border border-rose-300 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950">
          계정 및 데이터 삭제
        </button>
      </div>
    </div>
  );
}
