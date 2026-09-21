import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

// The random cookie is a bearer token. Only its hash is stored in Neon.
export async function getVisitorToken(): Promise<string | null> {
  const token = (await cookies()).get("recipe-book-visitor")?.value;
  return token && /^[a-f0-9]{64}$/.test(token) ? token : null;
}

export function createVisitorToken(): string {
  return randomBytes(32).toString("hex");
}

export function visitorId(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function setVisitorToken(token: string) {
  (await cookies()).set("recipe-book-visitor", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
