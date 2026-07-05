import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listContactSubmissions } from "@/lib/contact";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  return NextResponse.json(listContactSubmissions());
}
