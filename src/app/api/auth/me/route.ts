import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("marketplace_session")?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }

  const user = await verifySessionToken(token);
  return NextResponse.json({ user });
}
