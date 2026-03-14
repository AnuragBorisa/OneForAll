import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminCookieValue,
  isAdminProtectionEnabled,
  validateAdminPassword
} from "@/server/auth/admin";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/settings");
  const redirectUrl = new URL(nextPath.startsWith("/") ? nextPath : "/settings", request.url);

  if (!isAdminProtectionEnabled()) {
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  if (!validateAdminPassword(password)) {
    const deniedUrl = new URL("/settings?auth=1", request.url);
    return NextResponse.redirect(deniedUrl, { status: 303 });
  }

  const cookieStore = await cookies();
  const sessionValue = getAdminCookieValue();

  if (!sessionValue) {
    const deniedUrl = new URL("/settings?auth=1", request.url);
    return NextResponse.redirect(deniedUrl, { status: 303 });
  }

  cookieStore.set(ADMIN_SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return NextResponse.redirect(redirectUrl, { status: 303 });
}
