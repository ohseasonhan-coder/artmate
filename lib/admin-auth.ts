import "server-only";
import crypto from "crypto";

/**
 * 관리자 인증 (프로토타입용 서버 측 게이트).
 * - 비밀번호는 서버에서만 검증되어 클라이언트 번들에 노출되지 않는다.
 * - 계정은 환경변수 ADMIN_USERS("user:pass,user2:pass2")로 덮어쓸 수 있고,
 *   없으면 아래 기본값을 사용한다.
 * ⚠️ 기본 계정은 약한 데모 값이므로 실서비스에서는 반드시 교체하세요.
 */
const DEFAULT_USERS = "master:season,master1:J";

function getUsers(): Record<string, string> {
  const raw = process.env.ADMIN_USERS || DEFAULT_USERS;
  const map: Record<string, string> = {};
  for (const pair of raw.split(",")) {
    const [u, p] = pair.split(":");
    if (u && p) map[u.trim()] = p.trim();
  }
  return map;
}

const SECRET = process.env.ADMIN_SECRET || "artmate-prototype-admin-secret";
export const ADMIN_COOKIE = "artmate_admin";

export function verifyCredentials(username: string, password: string): boolean {
  const users = getUsers();
  const stored = users[username];
  if (!stored) return false;
  // 타이밍 공격 완화용 상수시간 비교
  const a = Buffer.from(stored);
  const b = Buffer.from(password);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function sign(value: string): string {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

/** 세션 토큰 생성: "username.signature" */
export function createSession(username: string): string {
  return `${username}.${sign(username)}`;
}

/** 세션 토큰 검증 → username | null */
export function verifySession(token: string | undefined): string | null {
  if (!token) return null;
  const idx = token.lastIndexOf(".");
  if (idx < 0) return null;
  const username = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = sign(username);
  const ok =
    sig.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  return ok && getUsers()[username] ? username : null;
}
