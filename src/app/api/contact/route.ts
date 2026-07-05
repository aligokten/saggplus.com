import { NextRequest, NextResponse } from "next/server";
import { createContactSubmission } from "@/lib/contact";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const { name, email, phone, message, website } = body as {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    website?: string; // honeypot field, must stay empty
  };

  // Honeypot: bots fill every field including hidden ones. Pretend success.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Ad, e-posta ve mesaj alanları zorunludur." },
      { status: 400 }
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    return NextResponse.json(
      { error: "Geçerli bir e-posta adresi girin." },
      { status: 400 }
    );
  }

  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "Girdi çok uzun." }, { status: 400 });
  }

  createContactSubmission({
    name: name.trim(),
    email: email.trim(),
    phone: phone?.trim() ?? "",
    message: message.trim(),
  });

  // NOTE: email delivery to info@saggplus.com is not wired up yet — submissions
  // are stored in the database and visible in /admin. To enable email delivery,
  // add SMTP env vars and send via nodemailer here once credentials are ready.

  return NextResponse.json({ ok: true });
}
