import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createProject, listProjects } from "@/lib/projects";
import { validateProjectInput } from "@/lib/projectValidation";

export async function GET(req: NextRequest) {
  const wantsAll = req.nextUrl.searchParams.get("all") === "1";
  if (wantsAll) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    return NextResponse.json(listProjects());
  }
  return NextResponse.json(listProjects({ onlyPublished: true }));
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const result = validateProjectInput(body);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  const project = createProject(result.input);
  return NextResponse.json(project, { status: 201 });
}
