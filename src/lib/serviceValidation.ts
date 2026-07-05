import type { ServiceInput } from "./services";
import { SERVICE_ICON_KEYS, DEFAULT_SERVICE_ICON } from "./serviceIcons";

export function validateServiceInput(
  body: unknown
): { input: ServiceInput } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Geçersiz istek." };
  const b = body as Record<string, unknown>;
  if (!b.title || typeof b.title !== "string" || !b.title.trim()) {
    return { error: "Başlık zorunludur." };
  }
  const icon =
    typeof b.icon === "string" && SERVICE_ICON_KEYS.includes(b.icon)
      ? b.icon
      : DEFAULT_SERVICE_ICON;

  return {
    input: {
      icon,
      title: b.title.trim(),
      description: typeof b.description === "string" ? b.description.trim() : "",
      published: b.published !== false,
    },
  };
}
