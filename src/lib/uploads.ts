import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

function getSupabaseStorageConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "marketplace-listings";

  if (!supabaseUrl || !serviceRoleKey) return null;
  return { supabaseUrl, serviceRoleKey, bucket };
}

function fileExtension(file: File) {
  const originalExt = extname(file.name).toLowerCase();
  return originalExt || `.${file.type.split("/")[1] || "jpg"}`;
}

export async function saveUploadedImage(file: File | null) {
  if (!file || file.size === 0) return null;

  if (!file.type.startsWith("image/")) {
    throw new Error("Foto duhet te jete image.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Foto nuk duhet te jete me e madhe se 5MB.");
  }

  const extension = fileExtension(file);
  const fileName = `${crypto.randomUUID()}${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const storage = getSupabaseStorageConfig();

  if (storage) {
    const objectPath = `listings/${fileName}`;
    const response = await fetch(
      `${storage.supabaseUrl}/storage/v1/object/${storage.bucket}/${objectPath}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storage.serviceRoleKey}`,
          apikey: storage.serviceRoleKey,
          "Content-Type": file.type || "application/octet-stream",
          "x-upsert": "false",
        },
        body: bytes,
      },
    );

    if (!response.ok) {
      throw new Error("Foto nuk u ngarkua ne Supabase Storage.");
    }

    return `${storage.supabaseUrl}/storage/v1/object/public/${storage.bucket}/${objectPath}`;
  }

  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  await writeFile(join(uploadDir, fileName), bytes);
  return `/uploads/${fileName}`;
}

export async function saveUploadedImages(files: File[]) {
  const saved: string[] = [];

  for (const file of files.slice(0, 10)) {
    const image = await saveUploadedImage(file);
    if (image) saved.push(image);
  }

  return saved;
}
