import { nanoid } from "nanoid";
import db from "./db";

export type TeamMemberRecord = {
  id: string;
  name: string;
  title: string;
  photo: string;
  sort_order: number;
  published: number;
  created_at: string;
};

export function listTeamMembers(
  opts: { onlyPublished?: boolean } = {}
): TeamMemberRecord[] {
  const rows = opts.onlyPublished
    ? db
        .prepare("SELECT * FROM team_members WHERE published = 1 ORDER BY sort_order ASC")
        .all()
    : db.prepare("SELECT * FROM team_members ORDER BY sort_order ASC").all();
  return rows as TeamMemberRecord[];
}

export function getTeamMember(id: string): TeamMemberRecord | null {
  const row = db.prepare("SELECT * FROM team_members WHERE id = ?").get(id);
  return (row as TeamMemberRecord) ?? null;
}

export type TeamMemberInput = {
  name: string;
  title: string;
  photo: string;
  published: boolean;
};

export function createTeamMember(input: TeamMemberInput): TeamMemberRecord {
  const id = nanoid();
  const maxOrder = db
    .prepare("SELECT MAX(sort_order) as m FROM team_members")
    .get() as { m: number | null };
  const sortOrder = (maxOrder.m ?? -1) + 1;

  db.prepare(
    `INSERT INTO team_members (id, name, title, photo, sort_order, published)
     VALUES (@id, @name, @title, @photo, @sort_order, @published)`
  ).run({
    id,
    name: input.name,
    title: input.title,
    photo: input.photo,
    sort_order: sortOrder,
    published: input.published ? 1 : 0,
  });

  return getTeamMember(id)!;
}

export function updateTeamMember(
  id: string,
  input: TeamMemberInput
): TeamMemberRecord | null {
  const existing = getTeamMember(id);
  if (!existing) return null;

  db.prepare(
    `UPDATE team_members SET name = @name, title = @title, photo = @photo, published = @published
     WHERE id = @id`
  ).run({
    id,
    name: input.name,
    title: input.title,
    photo: input.photo,
    published: input.published ? 1 : 0,
  });

  return getTeamMember(id);
}

export function deleteTeamMember(id: string): void {
  db.prepare("DELETE FROM team_members WHERE id = ?").run(id);
}

export function reorderTeamMembers(orderedIds: string[]): void {
  const update = db.prepare("UPDATE team_members SET sort_order = ? WHERE id = ?");
  const tx = db.transaction((ids: string[]) => {
    ids.forEach((id, index) => update.run(index, id));
  });
  tx(orderedIds);
}
