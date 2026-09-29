import { NextRequest, NextResponse } from "next/server";
import { AKUSTIK_COOKIE, verifyAkustikToken } from "@/lib/akustik";

export const dynamic = "force-dynamic";

/** Uygulamanın üst çubuğu için oturum bilgisi (demo kalan süresi, çıkış). */
export async function GET(req: NextRequest) {
  const user = await verifyAkustikToken(req.cookies.get(AKUSTIK_COOKIE)?.value);
  if (!user) return NextResponse.json({ error: "Oturum yok." }, { status: 401 });
  return NextResponse.json(
    { email: user.email, kind: user.kind, expires_at: user.expires_at },
    { headers: { "Cache-Control": "no-store" } }
  );
}
