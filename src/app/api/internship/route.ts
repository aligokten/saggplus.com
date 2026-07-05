import { NextRequest, NextResponse } from "next/server";
import { createInternshipApplication } from "@/lib/internship";

const INTERNSHIP_TYPES = new Set(["Ofis Stajı", "Şantiye Stajı"]);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const {
    full_name,
    school,
    department,
    term,
    internship_type,
    required_duration,
    email,
    phone,
    notes,
    website, // honeypot field, must stay empty
  } = body as Record<string, string | undefined>;

  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (
    !full_name?.trim() ||
    !school?.trim() ||
    !department?.trim() ||
    !term?.trim() ||
    !internship_type?.trim() ||
    !required_duration?.trim() ||
    !email?.trim()
  ) {
    return NextResponse.json(
      { error: "Zorunlu alanları eksiksiz doldurun." },
      { status: 400 }
    );
  }

  if (!INTERNSHIP_TYPES.has(internship_type.trim())) {
    return NextResponse.json({ error: "Geçersiz staj türü." }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    return NextResponse.json(
      { error: "Geçerli bir e-posta adresi girin." },
      { status: 400 }
    );
  }

  if (
    full_name.length > 200 ||
    school.length > 200 ||
    department.length > 200 ||
    email.length > 200 ||
    (notes?.length ?? 0) > 5000
  ) {
    return NextResponse.json({ error: "Girdi çok uzun." }, { status: 400 });
  }

  createInternshipApplication({
    full_name: full_name.trim(),
    school: school.trim(),
    department: department.trim(),
    term: term.trim(),
    internship_type: internship_type.trim(),
    required_duration: required_duration.trim(),
    email: email.trim(),
    phone: phone?.trim() ?? "",
    notes: notes?.trim() ?? "",
  });

  return NextResponse.json({ ok: true });
}
