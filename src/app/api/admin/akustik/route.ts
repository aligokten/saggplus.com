import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  AKUSTIK_KINDS,
  AkustikError,
  createAkustikUser,
  listAkustikUsers,
  type AkustikKind,
} from "@/lib/akustik";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  return NextResponse.json(listAkustikUsers());
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const kind = body?.kind as AkustikKind;
  const note = typeof body?.note === "string" ? body.note.slice(0, 500) : "";

  if (!AKUSTIK_KINDS.includes(kind)) {
    return NextResponse.json({ error: "Geçersiz hesap türü." }, { status: 400 });
  }

  try {
    const { user, password } = createAkustikUser({ email, kind, note });
    return NextResponse.json({ user, password }, { status: 201 });
  } catch (err) {
    if (err instanceof AkustikError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
}
