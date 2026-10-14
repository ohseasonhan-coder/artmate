import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySession } from "@/lib/admin-auth";
import { getServiceClient, hasServiceRole } from "@/lib/supabase-server";

const BUCKET = "assets";

export async function POST(req: Request) {
  // 관리자 인증 확인
  const store = await cookies();
  if (!verifySession(store.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: "관리자 권한이 필요합니다." }, { status: 401 });
  }

  // Supabase Storage 미설정 시: 클라이언트가 data URL로 폴백하도록 안내
  if (!hasServiceRole) {
    return NextResponse.json(
      { ok: false, error: "not-configured", message: "Supabase Storage 미연결 — 클라이언트 data URL로 저장됩니다." },
      { status: 501 },
    );
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "파일이 없습니다." }, { status: 400 });
  }

  const supabase = getServiceClient()!;
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const path = `site/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ ok: true, url: data.publicUrl });
}
