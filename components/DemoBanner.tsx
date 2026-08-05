import { isDemoMode } from "@/lib/config";

/**
 * Supabase 미연결 시 상단에 데모 모드 안내를 표시한다.
 * 연결되면 자동으로 사라진다.
 */
export default function DemoBanner() {
  if (!isDemoMode) return null;
  return (
    <div className="border-b border-[var(--demo)]/25 bg-[var(--demo-soft)] px-4 py-2 text-center text-xs text-[var(--demo)]">
      데모 모드로 실행 중입니다 · 샘플 데이터로 전체 흐름을 체험할 수 있으며, 저장 기능은 제한됩니다.
    </div>
  );
}
