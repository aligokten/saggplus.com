import { SITE_URL } from "./seo";

/**
 * Yeni form gönderimlerinde telefona anlık bildirim. İki kanal desteklenir:
 *  - Telegram botu: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
 *  - ntfy (https://ntfy.sh): NTFY_TOPIC (+ isteğe bağlı NTFY_SERVER, NTFY_TOKEN)
 * Hangi kanalın değişkenleri tanımlıysa o kullanılır, hiçbiri yoksa sessizce
 * geçilir. Bildirim gönderilemezse form isteği yine başarılı sayılır; kayıt
 * zaten veritabanında ve admin panelinde duruyor.
 */
type Notification = {
  title: string;
  /** "Etiket: değer" satırları; boş değerler atlanır. */
  fields: [label: string, value: string | undefined][];
  /** Mesaj / not gibi serbest metin. */
  body?: string;
  /** Başvuranın telefonu; WhatsApp düğmesi için kullanılır. */
  phone?: string;
  /** Bildirimden açılacak admin sayfası, ör. "/admin/messages". */
  adminPath?: string;
  /** ntfy etiketleri (emoji kısa adları). */
  ntfyTags?: string[];
};

export async function sendPhoneNotification(n: Notification): Promise<void> {
  await Promise.all([sendTelegram(n), sendNtfy(n)]);
}

/** Türkiye numaralarını uluslararası biçime çevirir: 0555… → 90555… */
function toInternationalDigits(phone: string): string | null {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = `9${digits}`;
  if (digits.length === 10 && digits.startsWith("5")) digits = `90${digits}`;
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function sendTelegram(n: Notification): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatIds = (process.env.TELEGRAM_CHAT_ID ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (!token || chatIds.length === 0) return;

  const phoneDigits = n.phone ? toInternationalDigits(n.phone) : null;

  const lines = [`<b>${escapeHtml(n.title)}</b>`, ""];
  for (const [label, value] of n.fields) {
    if (value) lines.push(`<b>${escapeHtml(label)}:</b> ${escapeHtml(value)}`);
  }
  if (n.phone) {
    // "+90…" biçimi Telegram'da dokununca aramayı açar.
    lines.push(`<b>Telefon:</b> ${phoneDigits ? `+${phoneDigits}` : escapeHtml(n.phone)}`);
  }
  if (n.body) lines.push("", escapeHtml(n.body.slice(0, 3000)));

  const buttons = [
    ...(phoneDigits ? [{ text: "💬 WhatsApp", url: `https://wa.me/${phoneDigits}` }] : []),
    ...(n.adminPath ? [{ text: "🗂 Panel", url: `${SITE_URL}${n.adminPath}` }] : []),
  ];

  await Promise.all(
    chatIds.map(async (chatId) => {
      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: lines.join("\n"),
            parse_mode: "HTML",
            link_preview_options: { is_disabled: true },
            ...(buttons.length ? { reply_markup: { inline_keyboard: [buttons] } } : {}),
          }),
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) {
          console.error(`Telegram bildirimi başarısız (${chatId}): HTTP ${res.status} ${await res.text()}`);
        }
      } catch (err) {
        console.error("Telegram bildirimi gönderilemedi:", err);
      }
    })
  );
}

async function sendNtfy(n: Notification): Promise<void> {
  const topic = process.env.NTFY_TOPIC?.trim();
  if (!topic) return;

  const server = (process.env.NTFY_SERVER?.trim() || "https://ntfy.sh").replace(/\/+$/, "");
  const token = process.env.NTFY_TOKEN?.trim();

  const lines = n.fields.filter(([, v]) => v).map(([label, v]) => `${label}: ${v}`);
  lines.push(`Telefon: ${n.phone || "-"}`);
  if (n.body) lines.push("", n.body);

  try {
    // JSON ile yayın: başlık ve mesajda Türkçe karakterler bozulmadan gider.
    const res = await fetch(server, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        topic,
        title: n.title,
        message: lines.join("\n").slice(0, 3000),
        tags: n.ntfyTags,
        priority: 4,
        ...(n.adminPath ? { click: `${SITE_URL}${n.adminPath}` } : {}),
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error(`ntfy bildirimi başarısız: HTTP ${res.status}`);
    }
  } catch (err) {
    console.error("ntfy bildirimi gönderilemedi:", err);
  }
}
