import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { createListing, listListings } from "@/lib/db";
import { listingToPublicListing } from "@/lib/listing-presenter";
import { saveUploadedImages } from "@/lib/uploads";

export const runtime = "nodejs";

async function getSessionUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("marketplace_session")?.value;
  if (!session) return null;
  return verifySessionToken(session);
}

export async function GET() {
  return NextResponse.json({ listings: (await listListings()).map(listingToPublicListing) });
}

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function collectSpecs(formData: FormData, year: number) {
  const specs: Record<string, string> = { Viti: String(Math.round(year)) };

  formData.forEach((value, key) => {
    if (!key.startsWith("spec_") || typeof value !== "string") return;
    const label = key.replace("spec_", "").trim();
    const text = value.trim();
    if (label && text) specs[label] = text;
  });

  return specs;
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Duhet te kycesh per te krijuar shpallje." }, { status: 401 });
  }

  const formData = await request.formData();
  const title = formValue(formData, "title");
  const category = formValue(formData, "category") || "Vetura";
  const price = Number(formValue(formData, "price"));
  const location = formValue(formData, "location");
  const year = Number(formValue(formData, "year"));
  const description = formValue(formData, "description");

  if (!title || !category || !location || !description || !Number.isFinite(price) || price <= 0 || !Number.isFinite(year)) {
    return NextResponse.json({ error: "Ploteso titullin, kategorine, cmimin, lokacionin, vitin dhe pershkrimin." }, { status: 400 });
  }

  let gallery: string[] = [];
  try {
    gallery = await saveUploadedImages(formData.getAll("images").filter((file): file is File => file instanceof File && file.size > 0));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Fotot nuk u ngarkuan." }, { status: 400 });
  }

  const specs = collectSpecs(formData, year);
  const transmission = specs.Transmisioni ?? null;

  const image = gallery[0] ?? null;
  const id = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 44)}-${crypto.randomUUID().slice(0, 8)}`;

  await createListing({
    id,
    sellerId: user.id,
    title,
    category,
    price: Math.round(price),
    location,
    year: Math.round(year),
    transmission,
    image,
    galleryJson: JSON.stringify(gallery),
    specsJson: JSON.stringify(specs),
    description,
  });

  const created = (await listListings()).find((item) => item.id === id);
  return NextResponse.json({ listing: created ? listingToPublicListing(created) : null });
}
