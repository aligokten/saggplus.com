import { nanoid } from "nanoid";
import db from "./db";

export type ServiceRecord = {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
  published: number;
  created_at: string;
};

export function listServices(opts: { onlyPublished?: boolean } = {}): ServiceRecord[] {
  const rows = opts.onlyPublished
    ? db
        .prepare("SELECT * FROM services WHERE published = 1 ORDER BY sort_order ASC")
        .all()
    : db.prepare("SELECT * FROM services ORDER BY sort_order ASC").all();
  return rows as ServiceRecord[];
}

export function getService(id: string): ServiceRecord | null {
  const row = db.prepare("SELECT * FROM services WHERE id = ?").get(id);
  return (row as ServiceRecord) ?? null;
}

export type ServiceInput = {
  icon: string;
  title: string;
  description: string;
  published: boolean;
};

export function createService(input: ServiceInput): ServiceRecord {
  const id = nanoid();
  const maxOrder = db.prepare("SELECT MAX(sort_order) as m FROM services").get() as {
    m: number | null;
  };
  const sortOrder = (maxOrder.m ?? -1) + 1;

  db.prepare(
    `INSERT INTO services (id, icon, title, description, sort_order, published)
     VALUES (@id, @icon, @title, @description, @sort_order, @published)`
  ).run({
    id,
    icon: input.icon,
    title: input.title,
    description: input.description,
    sort_order: sortOrder,
    published: input.published ? 1 : 0,
  });

  return getService(id)!;
}

export function updateService(id: string, input: ServiceInput): ServiceRecord | null {
  const existing = getService(id);
  if (!existing) return null;

  db.prepare(
    `UPDATE services SET icon = @icon, title = @title, description = @description, published = @published
     WHERE id = @id`
  ).run({
    id,
    icon: input.icon,
    title: input.title,
    description: input.description,
    published: input.published ? 1 : 0,
  });

  return getService(id);
}

export function deleteService(id: string): void {
  db.prepare("DELETE FROM services WHERE id = ?").run(id);
}

export function reorderServices(orderedIds: string[]): void {
  const update = db.prepare("UPDATE services SET sort_order = ? WHERE id = ?");
  const tx = db.transaction((ids: string[]) => {
    ids.forEach((id, index) => update.run(index, id));
  });
  tx(orderedIds);
}
