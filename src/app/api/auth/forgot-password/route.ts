import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { createPasswordResetToken, findUserByEmail } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

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

function buildResetUrl(request: Request, token: string) {
  const baseUrl = process.env.APP_URL || new URL(request.url).origin;
  return new URL(`/?view=auth&resetToken=${token}`, baseUrl).toString();
}

export async function POST(request: Request) {
  const { body, isForm } = await readBody(request);
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!email) {
    const message = "Shkruaj email-in e llogarise.";
    if (isForm) return NextResponse.redirect(new URL(`/?view=auth&error=${encodeURIComponent(message)}`, request.url));
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const user = await findUserByEmail(email);
  let resetUrl: string | null = null;

  if (user) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10).toISOString();
    await createPasswordResetToken({
      id: crypto.randomUUID(),
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt,
    });

    resetUrl = buildResetUrl(request, token);
    await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl });
  }

  const message = "Nese ky email ekziston, linku per resetim eshte derguar. Linku eshte valid 10 minuta.";
  if (isForm) {
    return NextResponse.redirect(new URL(`/?view=auth&success=${encodeURIComponent(message)}`, request.url));
  }

  return NextResponse.json({
    message,
    resetUrl: process.env.RESEND_API_KEY ? null : resetUrl,
  });
}
