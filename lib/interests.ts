"use client";

import { getSupabase } from "./supabase";

export type InterestType = "필요해요" | "출시 알림" | "우선 개발" | "의견";

const LS_KEY = "artmate:feature_interests";

interface LocalInterest {
  feature_key: string;
  interest_type: InterestType;
  comment?: string;
  created_at: string;
}

/**
 * 기능 관심 등록.
 * 로그인/Supabase 연결 시 feature_interests 테이블에 저장,
 * 미연결(비로그인) 시 localStorage에 익명 저장한다.
 */
export async function registerInterest(
  featureKey: string,
  interestType: InterestType,
  comment?: string,
): Promise<{ stored: "supabase" | "local" }> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase.from("feature_interests").insert({
        user_id: user?.id ?? null,
        feature_key: featureKey,
        interest_type: interestType,
        comment: comment ?? null,
      });
      if (!error) return { stored: "supabase" };
    } catch {
      /* 실패 시 로컬 폴백 */
    }
  }
  saveLocal({ feature_key: featureKey, interest_type: interestType, comment, created_at: new Date().toISOString() });
  return { stored: "local" };
}

function saveLocal(item: LocalInterest) {
  if (typeof window === "undefined") return;
  const list = getLocalInterests();
  list.push(item);
  window.localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export function getLocalInterests(): LocalInterest[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

/** 기능별 로컬 관심 등록 수 집계 (관리자 데모용) */
export function countLocalInterests(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const i of getLocalInterests()) {
    counts[i.feature_key] = (counts[i.feature_key] ?? 0) + 1;
  }
  return counts;
}
