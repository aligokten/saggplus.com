import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { nanoid } from "nanoid";
import db from "./db";

/**
 * akustik.saggplus.com (SAGG Akustik Hesap Aracı) kullanıcıları.
 *
 * İki tür hesap vardır:
 *  - "tam":  satın alan kullanıcı; süresi yoktur, yönetici iptal edene dek geçerlidir.
 *  - "demo": deneme hesabı; süre ilk başarılı girişte başlar ve DEMO_SURESI_SAAT
 *            sonra dolar. Süre dolunca şifre silinir ve hesap kalıcı olarak kapanır.
 *
 * Nginx, akustik.saggplus.com'a gelen her isteği /api/akustik/dogrula ile
 * denetler (auth_request); o uç bu dosyadaki verifyAkustikToken'ı kullanır.
 * Böylece iptal ve süre dolumu bir sonraki istekte hemen etkili olur.
 */

export const DEMO_SURESI_SAAT = 24;
const DEMO_SURESI_MS = DEMO_SURESI_SAAT * 60 * 60 * 1000;
/** Tam hesapta oturum çerezinin ömrü; süre dolunca yeniden giriş istenir. */
const TAM_OTURUM_MS = 7 * 24 * 60 * 60 * 1000;

export const AKUSTIK_COOKIE = "akustik_oturum";
const AUDIENCE = "akustik.saggplus.com";

export const AKUSTIK_KINDS = ["demo", "tam"] as const;
export type AkustikKind = (typeof AKUSTIK_KINDS)[number];

export type AkustikStatus = "bekliyor" | "aktif" | "suresi_doldu" | "iptal";

type AkustikRow = {
  id: string;
  email: string;
  password_hash: string;
  kind: AkustikKind;
  note: string;
  session_version: number;
  created_at: string;
  first_login_at: string | null;
  last_login_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  revoke_reason: string;
};

/** Yönetim paneline giden kayıt — şifre özeti hiçbir zaman dışarı çıkmaz. */
export type AkustikUser = Omit<AkustikRow, "password_hash" | "session_version"> & {
  status: AkustikStatus;
};

export function normalizeEmail(email: string): string {
  return email.trim().toLocaleLowerCase("en-US");
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

// Karıştırılabilecek karakterler (0/O, 1/l/I) çıkarıldı; şifre telefonda da okunur.
const ALFABE = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

/** 12 karakterlik, 4'erli gruplanmış rastgele şifre (ör. "hK7m-Qw3z-Rt9p"). */
export function generatePassword(): string {
  let s = "";
  for (let i = 0; i < 12; i++) s += ALFABE[randomInt(ALFABE.length)];
  return `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8)}`;
}

export function akustikStatus(row: AkustikRow, now: Date = new Date()): AkustikStatus {
  if (row.revoked_at) return row.revoke_reason === "sure_doldu" ? "suresi_doldu" : "iptal";
  if (row.expires_at && new Date(row.expires_at) <= now) return "suresi_doldu";
  if (row.kind === "demo" && !row.first_login_at) return "bekliyor";
  return "aktif";
}

function toPublic(row: AkustikRow, now: Date): AkustikUser {
  return {
    id: row.id,
    email: row.email,
    kind: row.kind,
    note: row.note,
    created_at: row.created_at,
    first_login_at: row.first_login_at,
    last_login_at: row.last_login_at,
    expires_at: row.expires_at,
    revoked_at: row.revoked_at,
    revoke_reason: row.revoke_reason,
    status: akustikStatus(row, now),
  };
}

function getRow(id: string): AkustikRow | undefined {
  return db.prepare("SELECT * FROM akustik_users WHERE id = ?").get(id) as AkustikRow | undefined;
}

/**
 * Süresi dolmuş demo hesaplarını kalıcı olarak kapatır: şifre silinir, hesap
 * "süresi doldu" gerekçesiyle iptal edilir ve açık oturumlar geçersiz olur.
 */
export function expireDueUsers(now: Date = new Date()): void {
  db.prepare(
    `UPDATE akustik_users
        SET password_hash = '', revoked_at = expires_at, revoke_reason = 'sure_doldu',
            session_version = session_version + 1
      WHERE expires_at IS NOT NULL AND expires_at <= ? AND revoked_at IS NULL`
  ).run(now.toISOString());
}

export function listAkustikUsers(now: Date = new Date()): AkustikUser[] {
  expireDueUsers(now);
  const rows = db
    .prepare("SELECT * FROM akustik_users ORDER BY created_at DESC")
    .all() as AkustikRow[];
  return rows.map((r) => toPublic(r, now));
}

export class AkustikError extends Error {}

export function createAkustikUser(input: {
  email: string;
  kind: AkustikKind;
  note?: string;
}): { user: AkustikUser; password: string } {
  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) throw new AkustikError("Geçerli bir e-posta adresi girin.");
  if (!AKUSTIK_KINDS.includes(input.kind)) throw new AkustikError("Geçersiz hesap türü.");

  const exists = db.prepare("SELECT 1 FROM akustik_users WHERE email = ?").get(email);
  if (exists) {
    throw new AkustikError(
      "Bu e-posta adresine tanımlı bir hesap zaten var. Yeni hesap açmak için önce eskisini silin."
    );
  }

  const id = nanoid();
  const password = generatePassword();
  const now = new Date();
  db.prepare(
    `INSERT INTO akustik_users (id, email, password_hash, kind, note, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, email, bcrypt.hashSync(password, 10), input.kind, (input.note ?? "").trim(), now.toISOString());

  return { user: toPublic(getRow(id)!, now), password };
}

/** Yeni şifre üretir; eski şifre ve açık oturumlar geçersiz olur. Demo süresine dokunmaz. */
export function resetAkustikPassword(id: string, now: Date = new Date()): string {
  expireDueUsers(now);
  const row = getRow(id);
  if (!row) throw new AkustikError("Kullanıcı bulunamadı.");
  const status = akustikStatus(row, now);
  if (status === "iptal" || status === "suresi_doldu") {
    throw new AkustikError("Kapanmış bir hesabın şifresi yenilenemez.");
  }
  const password = generatePassword();
  db.prepare(
    "UPDATE akustik_users SET password_hash = ?, session_version = session_version + 1 WHERE id = ?"
  ).run(bcrypt.hashSync(password, 10), id);
  return password;
}

/** Hesabı hemen kapatır: şifre silinir, açık oturumlar bir sonraki istekte düşer. */
export function revokeAkustikUser(id: string, now: Date = new Date()): void {
  db.prepare(
    `UPDATE akustik_users
        SET password_hash = '', revoked_at = ?, revoke_reason = 'yonetici',
            session_version = session_version + 1
      WHERE id = ? AND revoked_at IS NULL`
  ).run(now.toISOString(), id);
}

export function deleteAkustikUser(id: string): void {
  db.prepare("DELETE FROM akustik_users WHERE id = ?").run(id);
}

// Kullanıcı yokken de bcrypt karşılaştırması yapılır; yanıt süresinden
// hangi e-postaların kayıtlı olduğu anlaşılmasın.
const SAHTE_OZET = bcrypt.hashSync("sahte-sifre-zamanlama-icin", 10);

export type LoginResult =
  | { ok: true; user: AkustikUser; token: string; maxAgeSeconds: number }
  | { ok: false; error: string };

export async function loginAkustik(
  emailInput: string,
  password: string,
  now: Date = new Date()
): Promise<LoginResult> {
  expireDueUsers(now);
  const email = normalizeEmail(emailInput);
  const row = db.prepare("SELECT * FROM akustik_users WHERE email = ?").get(email) as
    | AkustikRow
    | undefined;

  const hash = row?.password_hash || SAHTE_OZET;
  const match = await bcrypt.compare(password, hash);

  if (row && !row.password_hash) {
    const status = akustikStatus(row, now);
    return {
      ok: false,
      error:
        status === "suresi_doldu"
          ? "Demo süreniz doldu. Programı satın almak için info@saggplus.com adresine yazabilirsiniz."
          : "Bu hesap kapatılmış. Bilgi için info@saggplus.com adresine yazabilirsiniz.",
    };
  }
  if (!row || !match) return { ok: false, error: "E-posta veya şifre hatalı." };

  // Demo süresi ilk başarılı girişte başlar. Koşullu UPDATE, aynı anda gelen
  // iki ilk girişte başlangıcın ikinci kez yazılmasını önler.
  if (!row.first_login_at) {
    const expiresAt =
      row.kind === "demo" ? new Date(now.getTime() + DEMO_SURESI_MS).toISOString() : null;
    db.prepare(
      `UPDATE akustik_users SET first_login_at = ?, expires_at = ?
        WHERE id = ? AND first_login_at IS NULL`
    ).run(now.toISOString(), expiresAt, row.id);
  }
  db.prepare("UPDATE akustik_users SET last_login_at = ? WHERE id = ?").run(now.toISOString(), row.id);

  const fresh = getRow(row.id)!;
  const expiresAt = fresh.expires_at
    ? new Date(fresh.expires_at)
    : new Date(now.getTime() + TAM_OTURUM_MS);
  const token = await new SignJWT({ v: fresh.session_version })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(fresh.id)
    .setAudience(AUDIENCE)
    .setIssuedAt(Math.floor(now.getTime() / 1000))
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(getSecret());

  return {
    ok: true,
    user: toPublic(fresh, now),
    token,
    maxAgeSeconds: Math.max(1, Math.floor((expiresAt.getTime() - now.getTime()) / 1000)),
  };
}

/**
 * Oturum çerezini doğrular. İmza ve süre yetmez: kullanıcı veritabanında hâlâ
 * etkin olmalı ve şifresi o oturumdan sonra değişmemiş olmalıdır.
 */
export async function verifyAkustikToken(
  token: string | undefined,
  now: Date = new Date()
): Promise<AkustikUser | null> {
  if (!token || !process.env.AKUSTIK_SESSION_SECRET) return null;
  let sub: string | undefined;
  let v: unknown;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      audience: AUDIENCE,
      currentDate: now,
    });
    sub = payload.sub;
    v = payload.v;
  } catch {
    return null;
  }
  if (!sub) return null;

  expireDueUsers(now);
  const row = getRow(sub);
  if (!row || row.session_version !== v || akustikStatus(row, now) !== "aktif") return null;
  return toPublic(row, now);
}

function getSecret(): Uint8Array {
  // Yönetici oturumundan ayrı bir anahtar: akustik çerezi hiçbir koşulda
  // /admin'e girişte kullanılamaz.
  const secret = process.env.AKUSTIK_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "AKUSTIK_SESSION_SECRET ortam değişkeni tanımlı değil. .env dosyanıza rastgele uzun bir gizli anahtar ekleyin."
    );
  }
  return new TextEncoder().encode(secret);
}

// --- Giriş denemesi sınırı (süreç belleğinde) ---------------------------------

const DENEME_PENCERESI_MS = 15 * 60 * 1000;
const EN_FAZLA_HATALI = 10;
const hataliDenemeler = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string, now = Date.now()): boolean {
  const e = hataliDenemeler.get(key);
  return !!e && e.resetAt > now && e.count >= EN_FAZLA_HATALI;
}

export function recordFailedLogin(key: string, now = Date.now()): void {
  const e = hataliDenemeler.get(key);
  if (!e || e.resetAt <= now) {
    hataliDenemeler.set(key, { count: 1, resetAt: now + DENEME_PENCERESI_MS });
  } else {
    e.count++;
  }
  if (hataliDenemeler.size > 10_000) {
    for (const [k, v] of hataliDenemeler) if (v.resetAt <= now) hataliDenemeler.delete(k);
  }
}
