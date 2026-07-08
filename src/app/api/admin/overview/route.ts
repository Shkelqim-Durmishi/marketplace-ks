import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isFounderEmail } from "@/lib/admin";
import { verifySessionToken } from "@/lib/auth";
import { getAdminOverview } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("marketplace_session")?.value;
  const user = session ? await verifySessionToken(session) : null;

  if (!user) {
    return NextResponse.json({ error: "Duhet te kycesh per Admin." }, { status: 401 });
  }

  if (!isFounderEmail(user.email)) {
    return NextResponse.json({ error: "Nuk ke qasje ne Admin." }, { status: 403 });
  }

  return NextResponse.json({ overview: await getAdminOverview() });
}
