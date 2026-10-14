import { NextResponse } from "next/server";
import { isAiConfigured, generate, generateJson } from "@/lib/ai";

export async function POST(req: Request) {
  // 키 미설정 → 클라이언트가 데모 콘텐츠로 폴백하도록 신호
  if (!isAiConfigured) {
    return NextResponse.json({ configured: false });
  }

  const body = await req.json().catch(() => ({}));
  const { task, input } = body ?? {};

  try {
    if (task === "profile") {
      const sys =
        "너는 한국 문화예술인의 섭외용 공개 프로필을 작성하는 전문 카피라이터다. " +
        "과장 없이 신뢰감 있게, 기업·기관 담당자가 빠르게 파악하도록 간결하게 쓴다. " +
        "반드시 지정한 JSON 스키마로만 답한다.";
      const user =
        `다음 정보로 프로필 초안을 만들어줘.\n${JSON.stringify(input, null, 2)}\n\n` +
        `JSON 키: introShort(한 문장 소개, string), strengths(핵심 강점 3개, string[]), ` +
        `careerSummary(경력 요약 2~3문장, string), featured(대표 경력 추천 제목 3개, string[]).`;
      const data = await generateJson(sys, user);
      return NextResponse.json({ configured: true, data });
    }

    if (task === "assistant") {
      const sys =
        "너는 문화예술인을 돕는 AI 개인비서다. 일정·섭외 문의·공연 준비·경력 관리를 돕는다. " +
        "한국어로 간결하고 실용적으로, 필요하면 목록으로 답한다.";
      const ctx = input?.context ? `\n\n[참고 데이터]\n${input.context}` : "";
      const text = await generate(sys, `${input?.question ?? ""}${ctx}`, { maxTokens: 800 });
      return NextResponse.json({ configured: true, text });
    }

    if (task === "search") {
      const sys =
        "너는 기업 행사 담당자를 위한 공연팀 매칭 도우미다. 요청과 후보 목록을 보고 " +
        "가장 적합한 순으로 추천한다. 반드시 지정 JSON으로만 답한다.";
      const user =
        `요청: ${input?.query}\n\n후보 목록:\n${JSON.stringify(input?.artists ?? [], null, 2)}\n\n` +
        `JSON 키: results(배열). 각 항목: slug(string), score(0~100 정수), reason(추천 사유 한 문장).`;
      const data = await generateJson<{ results: unknown[] }>(sys, user);
      return NextResponse.json({ configured: true, data });
    }

    return NextResponse.json({ configured: true, error: "알 수 없는 작업" }, { status: 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "AI 호출 오류";
    return NextResponse.json({ configured: true, error: msg }, { status: 200 });
  }
}
