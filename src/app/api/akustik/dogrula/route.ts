import { NextRequest } from "next/server";
import { AKUSTIK_COOKIE, verifyAkustikToken } from "@/lib/akustik";

export const dynamic = "force-dynamic";

/**
 * Nginx auth_request ucu: akustik.saggplus.com'a gelen her istek için çağrılır.
 * 204 → isteğe izin ver, 401 → giriş sayfasına yönlendir.
 */
export async function GET(req: NextRequest) {
  const user = await verifyAkustikToken(req.cookies.get(AKUSTIK_COOKIE)?.value);
  if (!user) return new Response(null, { status: 401 });
  return new Response(null, {
    status: 204,
    headers: { "X-Akustik-Kullanici": user.email },
  });
}
