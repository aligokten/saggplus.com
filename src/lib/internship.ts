import { nanoid } from "nanoid";
import db from "./db";

export type InternshipApplicationRecord = {
  id: string;
  full_name: string;
  school: string;
  department: string;
  term: string;
  internship_type: string;
  required_duration: string;
  email: string;
  phone: string;
  notes: string;
  created_at: string;
  is_read: number;
};

export type InternshipApplicationInput = {
  full_name: string;
  school: string;
  department: string;
  term: string;
  internship_type: string;
  required_duration: string;
  email: string;
  phone?: string;
  notes?: string;
};

export function createInternshipApplication(
  input: InternshipApplicationInput
): InternshipApplicationRecord {
  const id = nanoid();
  db.prepare(
    `INSERT INTO internship_applications
      (id, full_name, school, department, term, internship_type, required_duration, email, phone, notes)
     VALUES (@id, @full_name, @school, @department, @term, @internship_type, @required_duration, @email, @phone, @notes)`
  ).run({
    id,
    full_name: input.full_name,
    school: input.school,
    department: input.department,
    term: input.term,
    internship_type: input.internship_type,
    required_duration: input.required_duration,
    email: input.email,
    phone: input.phone ?? "",
    notes: input.notes ?? "",
  });
  return db
    .prepare("SELECT * FROM internship_applications WHERE id = ?")
    .get(id) as InternshipApplicationRecord;
}

export function listInternshipApplications(): InternshipApplicationRecord[] {
  return db
    .prepare("SELECT * FROM internship_applications ORDER BY created_at DESC")
    .all() as InternshipApplicationRecord[];
}
