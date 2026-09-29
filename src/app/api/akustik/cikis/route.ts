import { NextResponse } from "next/server";
import { AKUSTIK_COOKIE } from "@/lib/akustik";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AKUSTIK_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
