import Home from "@/components/Home";
import { getServerConfig } from "@/lib/site-config-server";

// 매 요청 시 최신 사이트 설정을 반영 (Supabase 연결 시 모든 방문자 공유)
export const dynamic = "force-dynamic";

export default async function Page() {
  const { config } = await getServerConfig();
  return <Home initial={config} />;
}
