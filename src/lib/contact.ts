import { nanoid } from "nanoid";
import db from "./db";

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  is_read: number;
};

export type ContactInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export function createContactSubmission(input: ContactInput): ContactSubmission {
  const id = nanoid();
  db.prepare(
    `INSERT INTO contact_submissions (id, name, email, phone, message)
     VALUES (@id, @name, @email, @phone, @message)`
  ).run({
    id,
    name: input.name,
    email: input.email,
    phone: input.phone ?? "",
    message: input.message,
  });
  return db
    .prepare("SELECT * FROM contact_submissions WHERE id = ?")
    .get(id) as ContactSubmission;
}

export function listContactSubmissions(): ContactSubmission[] {
  return db
    .prepare("SELECT * FROM contact_submissions ORDER BY created_at DESC")
    .all() as ContactSubmission[];
}
