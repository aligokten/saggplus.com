import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createService, listServices } from "@/lib/services";
import { validateServiceInput } from "@/lib/serviceValidation";

export async function GET(req: NextRequest) {
  const wantsAll = req.nextUrl.searchParams.get("all") === "1";
  if (wantsAll) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    return NextResponse.json(listServices());
  }
  return NextResponse.json(listServices({ onlyPublished: true }));
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const result = validateServiceInput(body);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  const service = createService(result.input);
  return NextResponse.json(service, { status: 201 });
}
