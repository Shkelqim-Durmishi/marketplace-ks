import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSessionToken, publicUser } from "@/lib/auth";
import { findUserByEmail } from "@/lib/db";

export const runtime = "nodejs";

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

export async function POST(request: Request) {
  const { body, isForm } = await readBody(request);
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    if (isForm) return authRedirect(request, "Shkruaj email-in dhe fjalekalimin.");
    return NextResponse.json({ error: "Shkruaj email-in dhe fjalekalimin." }, { status: 400 });
  }

  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    if (isForm) return authRedirect(request, "Ky account nuk ekziston ose fjalekalimi eshte i pasakte.");
    return NextResponse.json({ error: "Email ose fjalekalim i pasakte." }, { status: 401 });
  }

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
    const redirect = NextResponse.redirect(new URL("/?view=market&success=U kyce me sukses.", request.url));
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
