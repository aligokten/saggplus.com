import path from "node:path";
import fs from "node:fs/promises";
import { nanoid } from "nanoid";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function saveUploadedImage(
  file: File,
  subfolder: string
): Promise<{ url: string } | { error: string }> {
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return { error: "Sadece JPG, PNG, WEBP veya GIF yükleyebilirsiniz." };
  }
  if (file.size > MAX_SIZE) {
    return { error: "Dosya 10MB'dan büyük olamaz." };
  }

  const dir = path.join(process.cwd(), "public", "uploads", subfolder);
  await fs.mkdir(dir, { recursive: true });

  const filename = `${nanoid()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buffer);

  return { url: `/uploads/${subfolder}/${filename}` };
}
