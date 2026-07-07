import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { listListingsBySeller } from "@/lib/db";
import { listingToPublicListing } from "@/lib/listing-presenter";

export const runtime = "nodejs";

async function getSessionUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("marketplace_session")?.value;
  if (!session) return null;
  return verifySessionToken(session);
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Duhet te kycesh per te pare shpalljet e tua." }, { status: 401 });
  }

  return NextResponse.json({ listings: (await listListingsBySeller(user.id)).map(listingToPublicListing) });
}
