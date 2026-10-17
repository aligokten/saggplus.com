import { SITE_URL } from "./seo";

/**
 * Telefona anlık bildirim (https://ntfy.sh). NTFY_TOPIC tanımlı değilse hiçbir
 * şey yapmaz. Bildirim gönderilemezse form isteği yine başarılı sayılır; kayıt
 * zaten veritabanında ve admin panelinde duruyor.
 */
type Notification = {
  title: string;
  message: string;
  tags?: string[];
  /** Bildirime dokununca açılacak admin sayfası, ör. "/admin/messages". */
  adminPath?: string;
};

export async function sendPhoneNotification(n: Notification): Promise<void> {
  const topic = process.env.NTFY_TOPIC?.trim();
  if (!topic) return;

  const server = (process.env.NTFY_SERVER?.trim() || "https://ntfy.sh").replace(/\/+$/, "");
  const token = process.env.NTFY_TOKEN?.trim();

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
        message: n.message.slice(0, 3000),
        tags: n.tags,
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
