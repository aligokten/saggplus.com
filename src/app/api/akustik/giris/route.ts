import { NextRequest, NextResponse } from "next/server";
import {
  AKUSTIK_COOKIE,
  isRateLimited,
  loginAkustik,
  normalizeEmail,
  recordFailedLogin,
} from "@/lib/akustik";

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "bilinmiyor"
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email.trim() || !password) {
    return NextResponse.json({ error: "E-posta ve şifre gerekli." }, { status: 400 });
  }
  if (!process.env.AKUSTIK_SESSION_SECRET) {
    return NextResponse.json(
      { error: "Sunucu akustik girişi için yapılandırılmamış (.env eksik)." },
      { status: 500 }
    );
  }

  const keys = [`ip:${clientIp(req)}`, `eposta:${normalizeEmail(email)}`];
  if (keys.some((k) => isRateLimited(k))) {
    return NextResponse.json(
      { error: "Çok fazla hatalı deneme. Lütfen 15 dakika sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  const result = await loginAkustik(email, password);
  if (!result.ok) {
    keys.forEach((k) => recordFailedLogin(k));
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const res = NextResponse.json({
    ok: true,
    kind: result.user.kind,
    expires_at: result.user.expires_at,
  });
  res.cookies.set(AKUSTIK_COOKIE, result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: result.maxAgeSeconds,
  });
  return res;
}
