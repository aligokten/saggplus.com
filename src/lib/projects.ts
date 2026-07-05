import { nanoid } from "nanoid";
import db from "./db";

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string;
  year: string;
  summary: string;
  description: string;
  images: string[];
  sort_order: number;
  published: number;
  created_at: string;
};

type ProjectRow = Omit<Project, "images"> & { images: string };

function rowToProject(row: ProjectRow): Project {
  return { ...row, images: JSON.parse(row.images) as string[] };
}

export function listProjects(opts: { onlyPublished?: boolean } = {}): Project[] {
  const rows = opts.onlyPublished
    ? db
        .prepare(
          "SELECT * FROM projects WHERE published = 1 ORDER BY sort_order ASC, created_at DESC"
        )
        .all()
    : db
        .prepare("SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC")
        .all();
  return (rows as ProjectRow[]).map(rowToProject);
}

export function getProject(id: string): Project | null {
  const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as
    | ProjectRow
    | undefined;
  return row ? rowToProject(row) : null;
}

export function getProjectBySlug(slug: string): Project | null {
  const row = db.prepare("SELECT * FROM projects WHERE slug = ?").get(slug) as
    | ProjectRow
    | undefined;
  return row ? rowToProject(row) : null;
}

function slugify(title: string): string {
  const map: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return title
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function uniqueSlug(title: string, ignoreId?: string): string {
  const base = slugify(title) || "proje";
  let slug = base;
  let n = 1;
  while (true) {
    const existing = db
      .prepare("SELECT id FROM projects WHERE slug = ?")
      .get(slug) as { id: string } | undefined;
    if (!existing || existing.id === ignoreId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export type ProjectInput = {
  title: string;
  category: string;
  location: string;
  year: string;
  summary: string;
  description: string;
  images: string[];
  published: boolean;
};

export function createProject(input: ProjectInput): Project {
  const id = nanoid();
  const slug = uniqueSlug(input.title);
  const maxOrder = db
    .prepare("SELECT MAX(sort_order) as m FROM projects")
    .get() as { m: number | null };
  const sortOrder = (maxOrder.m ?? -1) + 1;

  db.prepare(
    `INSERT INTO projects
      (id, title, slug, category, location, year, summary, description, images, sort_order, published)
     VALUES (@id, @title, @slug, @category, @location, @year, @summary, @description, @images, @sort_order, @published)`
  ).run({
    id,
    title: input.title,
    slug,
    category: input.category,
    location: input.location,
    year: input.year,
    summary: input.summary,
    description: input.description,
    images: JSON.stringify(input.images),
    sort_order: sortOrder,
    published: input.published ? 1 : 0,
  });

  return getProject(id)!;
}

export function updateProject(id: string, input: ProjectInput): Project | null {
  const existing = getProject(id);
  if (!existing) return null;
  const slug =
    existing.title === input.title ? existing.slug : uniqueSlug(input.title, id);

  db.prepare(
    `UPDATE projects SET
      title = @title, slug = @slug, category = @category, location = @location,
      year = @year, summary = @summary, description = @description,
      images = @images, published = @published
     WHERE id = @id`
  ).run({
    id,
    title: input.title,
    slug,
    category: input.category,
    location: input.location,
    year: input.year,
    summary: input.summary,
    description: input.description,
    images: JSON.stringify(input.images),
    published: input.published ? 1 : 0,
  });

  return getProject(id);
}

export function deleteProject(id: string): void {
  db.prepare("DELETE FROM projects WHERE id = ?").run(id);
}

export function reorderProjects(orderedIds: string[]): void {
  const update = db.prepare("UPDATE projects SET sort_order = ? WHERE id = ?");
  const tx = db.transaction((ids: string[]) => {
    ids.forEach((id, index) => update.run(index, id));
  });
  tx(orderedIds);
}
