import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deleteProject, getProject, updateProject } from "@/lib/projects";
import { validateProjectInput } from "@/lib/projectValidation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { id } = await params;
  const project = getProject(id);
  if (!project) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const result = validateProjectInput(body);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  const project = updateProject(id, result.input);
  if (!project) return NextResponse.json({ error: "Bulunamadı." }, { status: 404 });
  return NextResponse.json(project);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const { id } = await params;
  deleteProject(id);
  return NextResponse.json({ ok: true });
}
