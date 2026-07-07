import type { DbListing } from "@/lib/db";

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function listingToPublicListing(item: DbListing) {
  const gallery = parseJson<string[]>(item.galleryJson, []);
  const image =
    item.image ||
    gallery[0] ||
    "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80";

  return {
    id: item.id,
    title: item.title,
    category: item.category,
    price: item.price,
    location: item.location,
    year: item.year,
    transmission: item.transmission ?? undefined,
    verified: true,
    score: item.status === "SOLD" ? 72 : 86,
    image,
    gallery: gallery.length ? gallery : [image],
    specs: parseJson<Record<string, string>>(item.specsJson, {}),
    seller: {
      name: item.sellerName,
      type: item.sellerRole,
      phone: item.sellerPhone ?? "Pa telefon",
      rating: "I ri",
      verifiedSince: "Shites ne Marketplace-ks",
    },
    description: item.description,
    priceInsight: "Shpallje e krijuar nga shitesi.",
    risk: "Ne monitorim",
    status: item.status,
  };
}
