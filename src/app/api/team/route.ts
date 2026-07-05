import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createTeamMember, listTeamMembers } from "@/lib/team";
import { validateTeamMemberInput } from "@/lib/teamValidation";

export async function GET(req: NextRequest) {
  const wantsAll = req.nextUrl.searchParams.get("all") === "1";
  if (wantsAll) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    return NextResponse.json(listTeamMembers());
  }
  return NextResponse.json(listTeamMembers({ onlyPublished: true }));
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const result = validateTeamMemberInput(body);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  const member = createTeamMember(result.input);
  return NextResponse.json(member, { status: 201 });
}
