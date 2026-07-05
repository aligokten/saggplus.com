import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { reorderServices } from "@/lib/services";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const ids = body?.ids;
  if (!Array.isArray(ids) || !ids.every((x) => typeof x === "string")) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  reorderServices(ids);
  return NextResponse.json({ ok: true });
}
