import { TourModel } from "../models/Tour";

const SAMPLE_TOURS = [
  {
    name: "Napa Valley Estate Trail",
    description:
      "Visit three family-run estates with guided tastings, cave tours, and a seasonal lunch pairing.",
    pricePerPerson: 189,
    date: "2025-06-14",
    duration: "Full day (8 hours)",
    mainImage:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80",
      "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=1200&q=80",
    ],
  },
  {
    name: "Sonoma Coast Pinot Intensive",
    description:
      "Focused walk through cool-climate Pinot Noir vineyards with a winemaker-led blending workshop.",
    pricePerPerson: 225,
    date: "2025-07-05",
    duration: "6 hours",
    mainImage:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1470158499416-75be9aa0c4db?w=1200&q=80",
    ],
  },
  {
    name: "Healdsburg Food & Wine Loop",
    description:
      "Small-group tour combining urban tasting rooms, farm stops, and artisan cheese pairings.",
    pricePerPerson: 165,
    date: "2025-08-02",
    duration: "5 hours",
    mainImage:
      "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=1200&q=80",
    galleryImages: [],
  },
  {
    name: "Sunset Vineyard Picnic",
    description:
      "Late afternoon tastings, short vineyard hike, and chef-prepared picnic as the sun sets.",
    pricePerPerson: 142,
    date: "2025-09-20",
    duration: "4 hours",
    mainImage:
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&q=80",
    galleryImages: [],
  },
] as const;

export async function seedToursIfEmpty(): Promise<void> {
  const count = await TourModel.countDocuments();
  if (count > 0) return;
  await TourModel.insertMany([...SAMPLE_TOURS]);
  console.log(`[seed] Inserted ${SAMPLE_TOURS.length} sample tours`);
}
