import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findPasswordResetToken, markPasswordResetTokenUsed, updateUserPassword } from "@/lib/db";

export const runtime = "nodejs";

async function readBody(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return { body: await request.json(), isForm: false };
  }

  const formData = await request.formData();
  return { body: Object.fromEntries(formData.entries()), isForm: true };
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function authRedirect(request: Request, message: string) {
  return NextResponse.redirect(new URL(`/?view=auth&error=${encodeURIComponent(message)}`, request.url));
}

export async function POST(request: Request) {
  const { body, isForm } = await readBody(request);
  const token = String(body.token ?? "");
  const password = String(body.password ?? "");
  const confirmPassword = String(body.confirmPassword ?? "");

  if (!token || !password || !confirmPassword) {
    const message = "Ploteso fjalekalimin e ri.";
    if (isForm) return authRedirect(request, message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (password.length < 6) {
    const message = "Fjalekalimi duhet te kete se paku 6 karaktere.";
    if (isForm) return authRedirect(request, message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (password !== confirmPassword) {
    const message = "Fjalekalimet nuk perputhen.";
    if (isForm) return authRedirect(request, message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const resetToken = await findPasswordResetToken(hashToken(token));
  if (!resetToken || new Date(resetToken.expiresAt).getTime() < Date.now()) {
    const message = "Linku i resetimit ka skaduar ose nuk eshte valid.";
    if (isForm) return authRedirect(request, message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  await updateUserPassword(resetToken.userId, await bcrypt.hash(password, 12));
  await markPasswordResetTokenUsed(resetToken.id);

  const message = "Fjalekalimi u ndryshua. Tani mund te kycesh.";
  if (isForm) {
    return NextResponse.redirect(new URL(`/?view=auth&success=${encodeURIComponent(message)}`, request.url));
  }

  return NextResponse.json({ message });
}
