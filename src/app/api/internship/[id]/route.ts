import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  INTERNSHIP_STATUSES,
  deleteInternshipApplication,
  updateInternshipApplicationStatus,
} from "@/lib/internship";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const status = body?.status;

  if (
    typeof status !== "string" ||
    !INTERNSHIP_STATUSES.includes(status as (typeof INTERNSHIP_STATUSES)[number])
  ) {
    return NextResponse.json({ error: "Geçersiz durum." }, { status: 400 });
  }

  const application = updateInternshipApplicationStatus(
    id,
    status as (typeof INTERNSHIP_STATUSES)[number]
  );
  if (!application) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  return NextResponse.json(application);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { id } = await params;
  deleteInternshipApplication(id);
  return NextResponse.json({ ok: true });
}
