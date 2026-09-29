import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  AkustikError,
  deleteAkustikUser,
  resetAkustikPassword,
  revokeAkustikUser,
} from "@/lib/akustik";

type Params = { params: Promise<{ id: string }> };

/** { action: "iptal" } hesabı kapatır; { action: "sifre" } yeni şifre üretir. */
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);

  try {
    if (body?.action === "iptal") {
      revokeAkustikUser(id);
      return NextResponse.json({ ok: true });
    }
    if (body?.action === "sifre") {
      return NextResponse.json({ password: resetAkustikPassword(id) });
    }
  } catch (err) {
    if (err instanceof AkustikError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
  return NextResponse.json({ error: "Geçersiz işlem." }, { status: 400 });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { id } = await params;
  deleteAkustikUser(id);
  return NextResponse.json({ ok: true });
}
