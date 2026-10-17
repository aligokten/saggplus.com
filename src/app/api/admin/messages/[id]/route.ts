import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deleteContactSubmission } from "@/lib/contact";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { id } = await params;
  deleteContactSubmission(id);
  return NextResponse.json({ ok: true });
}
