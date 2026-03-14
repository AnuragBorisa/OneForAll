import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/server/auth/admin";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);

  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
