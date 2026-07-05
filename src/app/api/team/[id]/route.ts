import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deleteTeamMember, getTeamMember, updateTeamMember } from "@/lib/team";
import { validateTeamMemberInput } from "@/lib/teamValidation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { id } = await params;
  const member = getTeamMember(id);
  if (!member) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  return NextResponse.json(member);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const result = validateTeamMemberInput(body);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  const member = updateTeamMember(id, result.input);
  if (!member) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  return NextResponse.json(member);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { id } = await params;
  deleteTeamMember(id);
  return NextResponse.json({ ok: true });
}
