import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSettings, updateSettings } from "@/lib/settings";

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  const settings = updateSettings({
    hero_image: typeof b.hero_image === "string" && b.hero_image.trim() ? b.hero_image.trim() : "/hero.jpg",
    announcement_enabled: Boolean(b.announcement_enabled),
    announcement_text: typeof b.announcement_text === "string" ? b.announcement_text.trim() : "",
  });

  return NextResponse.json(settings);
}
