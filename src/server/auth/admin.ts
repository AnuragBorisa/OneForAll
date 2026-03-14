import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getEnv } from "@/lib/env";

export const ADMIN_SESSION_COOKIE = "oneforall_admin_session";

function toSessionValue(password: string): string {
  return createHash("sha256").update(`oneforall:${password}`).digest("hex");
}

function safeMatches(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function isAdminProtectionEnabled(): boolean {
  return Boolean(getEnv().ADMIN_PASSWORD);
}

export function getAdminCookieValue(): string | null {
  const password = getEnv().ADMIN_PASSWORD;

  if (!password) {
    return null;
  }

  return toSessionValue(password);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  if (!isAdminProtectionEnabled()) {
    return true;
  }

  const sessionValue = getAdminCookieValue();

  if (!sessionValue) {
    return false;
  }

  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!cookieValue) {
    return false;
  }

  return safeMatches(cookieValue, sessionValue);
}

export function validateAdminPassword(input: string): boolean {
  const password = getEnv().ADMIN_PASSWORD;

  if (!password) {
    return false;
  }

  return safeMatches(input, password);
}
