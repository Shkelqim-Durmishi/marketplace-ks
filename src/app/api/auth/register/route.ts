import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSessionToken, publicUser } from "@/lib/auth";
import { createEmailVerificationToken, createUser, findUserByEmail } from "@/lib/db";
import { sendEmailVerificationEmail, sendWelcomeEmail } from "@/lib/email";

export const runtime = "nodejs";

const roleMap: Record<string, string> = {
  Bleres: "BUYER",
  Buyer: "BUYER",
  Shites: "SELLER",
  Seller: "SELLER",
  "Auto-sallon": "DEALER",
  Dealer: "DEALER",
  Biznes: "BUSINESS",
  Business: "BUSINESS",
};

async function readBody(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return { body: await request.json(), isForm: false };
  }

  const formData = await request.formData();
  return { body: Object.fromEntries(formData.entries()), isForm: true };
}

function authRedirect(request: Request, message: string) {
  return NextResponse.redirect(new URL(`/?view=auth&error=${encodeURIComponent(message)}`, request.url));
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function buildVerifyUrl(request: Request, token: string) {
  const baseUrl = process.env.APP_URL || new URL(request.url).origin;
  return new URL(`/api/auth/verify-email?token=${token}`, baseUrl).toString();
}

export async function POST(request: Request) {
  const { body, isForm } = await readBody(request);
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  const password = String(body.password ?? "");
  const role = roleMap[String(body.role ?? "Bleres")] ?? "BUYER";

  if (!name || !email || !password) {
    if (isForm) return authRedirect(request, "Ploteso emrin, email-in dhe fjalekalimin.");
    return NextResponse.json({ error: "Ploteso emrin, email-in dhe fjalekalimin." }, { status: 400 });
  }

  if (password.length < 6) {
    if (isForm) return authRedirect(request, "Fjalekalimi duhet te kete se paku 6 karaktere.");
    return NextResponse.json({ error: "Fjalekalimi duhet te kete se paku 6 karaktere." }, { status: 400 });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    if (isForm) return authRedirect(request, "Ky email ekziston. Provo te kycesh.");
    return NextResponse.json({ error: "Ky email ekziston. Provo te kycesh." }, { status: 409 });
  }

  const user = await createUser({
    id: crypto.randomUUID(),
    name,
    email,
    phone: phone || null,
    role,
    passwordHash: await bcrypt.hash(password, 12),
  });
  if (!user) {
    if (isForm) return authRedirect(request, "Nuk u krijua llogaria.");
    return NextResponse.json({ error: "Nuk u krijua llogaria." }, { status: 500 });
  }

  const verificationToken = randomBytes(32).toString("hex");
  await createEmailVerificationToken({
    id: crypto.randomUUID(),
    userId: user.id,
    tokenHash: hashToken(verificationToken),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  });

  await sendEmailVerificationEmail({
    to: user.email,
    name: user.name,
    verifyUrl: buildVerifyUrl(request, verificationToken),
  });
  await sendWelcomeEmail({ to: user.email, name: user.name });

  const sessionUser = publicUser(user);
  const token = await createSessionToken(sessionUser);
  const response = NextResponse.json({ user: sessionUser });
  response.cookies.set("marketplace_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  if (isForm) {
    const redirect = NextResponse.redirect(new URL("/?view=market&success=Llogaria u krijua.", request.url));
    redirect.cookies.set("marketplace_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return redirect;
  }
  return response;
}
