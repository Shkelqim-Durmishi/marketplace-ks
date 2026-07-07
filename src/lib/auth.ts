import { SignJWT, jwtVerify } from "jose";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret-change-this-before-production");

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
};

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({
    name: user.name,
    email: user.email,
    phone: user.phone ?? null,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub || !payload.email || !payload.name || !payload.role) return null;

    return {
      id: payload.sub,
      name: String(payload.name),
      email: String(payload.email),
      phone: payload.phone ? String(payload.phone) : null,
      role: String(payload.role),
    };
  } catch {
    return null;
  }
}

export function publicUser(user: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}
