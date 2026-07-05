import db from "./db";

export type SiteSettings = {
  hero_image: string;
  announcement_enabled: number;
  announcement_text: string;
};

export function getSettings(): SiteSettings {
  const row = db
    .prepare("SELECT hero_image, announcement_enabled, announcement_text FROM site_settings WHERE id = 1")
    .get() as SiteSettings | undefined;
  return row ?? { hero_image: "/hero.jpg", announcement_enabled: 0, announcement_text: "" };
}

export type SettingsInput = {
  hero_image: string;
  announcement_enabled: boolean;
  announcement_text: string;
};

export function updateSettings(input: SettingsInput): SiteSettings {
  db.prepare(
    `UPDATE site_settings SET hero_image = @hero_image,
      announcement_enabled = @announcement_enabled,
      announcement_text = @announcement_text
     WHERE id = 1`
  ).run({
    hero_image: input.hero_image,
    announcement_enabled: input.announcement_enabled ? 1 : 0,
    announcement_text: input.announcement_text,
  });
  return getSettings();
}
