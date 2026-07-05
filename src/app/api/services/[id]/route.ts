import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deleteService, getService, updateService } from "@/lib/services";
import { validateServiceInput } from "@/lib/serviceValidation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { id } = await params;
  const service = getService(id);
  if (!service) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  return NextResponse.json(service);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const result = validateServiceInput(body);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  const service = updateService(id, result.input);
  if (!service) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  return NextResponse.json(service);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { id } = await params;
  deleteService(id);
  return NextResponse.json({ ok: true });
}
