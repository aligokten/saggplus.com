import type { TeamMemberInput } from "./team";

export function validateTeamMemberInput(
  body: unknown
): { input: TeamMemberInput } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Geçersiz istek." };
  const b = body as Record<string, unknown>;
  if (!b.name || typeof b.name !== "string" || !b.name.trim()) {
    return { error: "İsim zorunludur." };
  }

  return {
    input: {
      name: b.name.trim(),
      title: typeof b.title === "string" ? b.title.trim() : "",
      photo: typeof b.photo === "string" ? b.photo.trim() : "",
      published: b.published !== false,
    },
  };
}
