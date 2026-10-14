import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySession } from "@/lib/admin-auth";
import { getServiceClient, hasServiceRole } from "@/lib/supabase-server";
import { getServerConfig, SITE_CONFIG_ID } from "@/lib/site-config-server";

// 공개 읽기: 현재 사이트 설정과 출처 반환
export async function GET() {
  const { config, source } = await getServerConfig();
  return NextResponse.json({ config, source });
}

// 관리자 쓰기: 서비스 롤로 site_config 업서트 (RLS 우회)
export async function POST(req: Request) {
  const store = await cookies();
  if (!verifySession(store.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: "관리자 권한이 필요합니다." }, { status: 401 });
  }
  if (!hasServiceRole) {
    return NextResponse.json(
      { ok: false, error: "not-configured", message: "Supabase 미연결 — 설정은 이 브라우저에만 저장됩니다." },
      { status: 501 },
    );
  }
  const body = await req.json().catch(() => null);
  if (!body?.config) {
    return NextResponse.json({ ok: false, error: "config 누락" }, { status: 400 });
  }
  const supabase = getServiceClient()!;
  const { error } = await supabase
    .from("site_config")
    .upsert({ id: SITE_CONFIG_ID, data: body.config, updated_at: new Date().toISOString() });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
