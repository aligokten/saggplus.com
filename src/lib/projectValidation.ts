import type { ProjectInput } from "./projects";

export function validateProjectInput(
  body: unknown
): { input: ProjectInput } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Geçersiz istek." };
  const b = body as Record<string, unknown>;
  if (!b.title || typeof b.title !== "string" || !b.title.trim()) {
    return { error: "Başlık zorunludur." };
  }
  const images = Array.isArray(b.images)
    ? b.images.filter((x): x is string => typeof x === "string")
    : [];
  return {
    input: {
      title: b.title.trim(),
      category: typeof b.category === "string" ? b.category.trim() : "",
      location: typeof b.location === "string" ? b.location.trim() : "",
      year: typeof b.year === "string" ? b.year.trim() : "",
      summary: typeof b.summary === "string" ? b.summary.trim() : "",
      description: typeof b.description === "string" ? b.description.trim() : "",
      images,
      published: b.published !== false,
    },
  };
}
