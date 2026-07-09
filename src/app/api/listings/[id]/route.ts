import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { deleteListing, findListingForSeller, updateListingDetails, updateListingStatus } from "@/lib/db";
import { listingToPublicListing } from "@/lib/listing-presenter";
import { saveUploadedImages } from "@/lib/uploads";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getSessionUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("marketplace_session")?.value;
  if (!session) return null;
  return verifySessionToken(session);
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

function parseGallery(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Duhet te kycesh." }, { status: 401 });
  }

  const { id } = await context.params;
  const listing = await findListingForSeller(id, user.id);
  if (!listing) {
    return NextResponse.json({ error: "Shpallja nuk u gjet." }, { status: 404 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
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

    let gallery = parseGallery(listing.galleryJson);
    try {
      const uploadedImages = await saveUploadedImages(formData.getAll("images").filter((file): file is File => file instanceof File && file.size > 0));
      if (uploadedImages.length) gallery = uploadedImages;
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Fotot nuk u ngarkuan." }, { status: 400 });
    }

    const specs = collectSpecs(formData, year);
    const transmission = specs.Transmisioni ?? null;

    const image = gallery[0] ?? listing.image;
    await updateListingDetails(id, user.id, {
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

    const updated = await findListingForSeller(id, user.id);
    return NextResponse.json({ listing: updated ? listingToPublicListing(updated) : null });
  }

  const body = await request.json();
  const status = String(body.status ?? "").toUpperCase();
  if (!["ACTIVE", "SOLD"].includes(status)) {
    return NextResponse.json({ error: "Status i pavlefshem." }, { status: 400 });
  }

  await updateListingStatus(id, user.id, status);
  return NextResponse.json({ ok: true, status });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Duhet te kycesh." }, { status: 401 });
  }

  const { id } = await context.params;
  const listing = await findListingForSeller(id, user.id);
  if (!listing) {
    return NextResponse.json({ error: "Shpallja nuk u gjet." }, { status: 404 });
  }

  await deleteListing(id, user.id);
  return NextResponse.json({ ok: true });
}
