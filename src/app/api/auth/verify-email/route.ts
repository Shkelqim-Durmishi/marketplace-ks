import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { findEmailVerificationToken, markEmailVerificationTokenUsed, markUserEmailVerified } from "@/lib/db";

export const runtime = "nodejs";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";

  if (!token) {
    return NextResponse.redirect(new URL("/?view=auth&error=Linku i verifikimit nuk eshte valid.", request.url));
  }

  const verificationToken = await findEmailVerificationToken(hashToken(token));
  if (!verificationToken || new Date(verificationToken.expiresAt).getTime() < Date.now()) {
    return NextResponse.redirect(new URL("/?view=auth&error=Linku i verifikimit ka skaduar ose nuk eshte valid.", request.url));
  }

  await markUserEmailVerified(verificationToken.userId);
  await markEmailVerificationTokenUsed(verificationToken.id);

  return NextResponse.redirect(new URL("/?view=auth&success=Email-i u verifikua. Tani mund te vazhdosh.", request.url));
}
