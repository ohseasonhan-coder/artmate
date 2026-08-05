"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

const SUGGESTIONS = [
  "다음 주 일정을 정리해줘.",
  "답변하지 않은 기업 문의를 보여줘.",
  "이번 공연 준비사항을 만들어줘.",
  "지난달 활동을 정리해줘.",
];

// 정해진 데모 응답 (실제 AI 대화 미연결 시)
const DEMO_REPLIES: Record<string, string> = {
  "다음 주 일정을 정리해줘.":
    "다음 주 일정은 3건입니다.\n· 8/8(토) 그랜드호텔 갈라디너 공연 (확정)\n· 8/10(월) 성남축제 리허설\n· 8/12(수) 한빛전자 담당자 미팅 (온라인)\n리허설 전날 음향 장비 점검을 추천드려요.",
  "답변하지 않은 기업 문의를 보여줘.":
    "답변이 필요한 문의 2건입니다.\n· (주)한빛전자 — 창립 20주년 기념식 (신규 문의)\n· 성남문화재단 — 가을 시민문화축제 (협의 중)\n한빛전자 건은 접수 3일 경과, 우선 회신을 권장합니다.",
  "이번 공연 준비사항을 만들어줘.":
    "그랜드호텔 갈라디너 준비 체크리스트 초안입니다.\n□ 선곡 리스트 확정  □ 음향 장비 확인  □ 리허설 일정 조율  □ 복장·의상 준비  □ 주차·입장 동선 확인",
  "지난달 활동을 정리해줘.":
    "지난달 활동은 2건입니다.\n· 성남시 가을문화축제 초청공연\n· 그랜드호텔 갈라디너 라이브\n두 건 모두 경력 추가 후보로 등록되어 있습니다. 프로필에 반영하시겠어요?",
};

interface Msg { role: "user" | "ai"; text: string; }

export default function AssistantPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "안녕하세요! AI 개인비서입니다. 일정·문의·준비사항·경력을 도와드릴게요. 아래 예시를 눌러보세요." },
  ]);
  const [input, setInput] = useState("");

  function ask(q: string) {
    const reply = DEMO_REPLIES[q] ??
      "데모 모드에서는 정해진 예시 질문에만 답변합니다. 실제 서비스에서는 일정·문의·경력 데이터를 바탕으로 자유롭게 대화할 수 있습니다.";
    setMsgs((m) => [...m, { role: "user", text: q }, { role: "ai", text: reply }]);
    setInput("");
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">AI 개인비서</h1>
        <StatusBadge status="demo" />
      </div>
      <p className="mt-2 rounded-lg bg-[var(--demo-soft)] p-3 text-sm text-[var(--demo)]">
        실제 AI 대화 연결은 구현 중입니다. 현재는 정해진 예시 질문에 데모 응답을 제공합니다.
      </p>

      <div className="mt-5 card flex h-[60vh] flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user" ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "bg-[var(--surface-2)]"
              }`}>
                {m.role === "ai" && <Sparkles size={13} className="mb-1 inline text-[var(--accent)]" />} {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-3">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => ask(s)} className="rounded-full border px-2.5 py-1 text-xs hover:bg-[var(--surface-2)]">
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) ask(input.trim()); }} className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="무엇이든 물어보세요…"
              className="flex-1 rounded-lg border bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]" />
            <button className="btn-primary grid place-items-center rounded-lg px-3"><Send size={16} /></button>
          </form>
        </div>
      </div>
    </div>
  );
}
