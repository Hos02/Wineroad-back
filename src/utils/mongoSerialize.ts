import type { Types } from "mongoose";

export type TourLocaleBlockJson = {
  title: string;
  description: string;
  duration: string;
};

type LeanTour = {
  _id: Types.ObjectId;
  locales?: {
    en?: TourLocaleBlockJson;
    ru?: TourLocaleBlockJson;
    am?: TourLocaleBlockJson;
  };
  name?: string;
  description?: string;
  duration?: string;
  pricePerPerson: number;
  date: string;
  bookableDates?: string[];
  isHidden?: boolean;
  mainImage: string;
  galleryImages?: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

const emptyLocale = (): TourLocaleBlockJson => ({
  title: "",
  description: "",
  duration: "",
});

function normalizeLocales(doc: LeanTour): {
  en: TourLocaleBlockJson;
  ru: TourLocaleBlockJson;
  am: TourLocaleBlockJson;
} {
  const hasNew =
    doc.locales &&
    (doc.locales.en?.title?.trim() ||
      doc.locales.en?.description?.trim() ||
      doc.locales.en?.duration?.trim() ||
      doc.locales.ru?.title?.trim() ||
      doc.locales.am?.title?.trim());

  if (hasNew && doc.locales) {
    return {
      en: { ...emptyLocale(), ...doc.locales.en },
      ru: { ...emptyLocale(), ...doc.locales.ru },
      am: { ...emptyLocale(), ...doc.locales.am },
    };
  }

  return {
    en: {
      title: doc.name ?? "",
      description: doc.description ?? "",
      duration: doc.duration ?? "",
    },
    ru: emptyLocale(),
    am: emptyLocale(),
  };
}

function normalizeBookableDatesForApi(doc: LeanTour): string[] {
  const fromDb = (doc.bookableDates ?? [])
    .map((s) => String(s).trim())
    .filter((s) => /^\d{4}-\d{2}-\d{2}$/.test(s));
  if (fromDb.length) return [...new Set(fromDb)].sort();
  const legacy = String(doc.date ?? "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(legacy)) return [legacy];
  return [];
}

export function formatTour(doc: LeanTour) {
  const locales = normalizeLocales(doc);
  const bookableDates = normalizeBookableDatesForApi(doc);
  const date = bookableDates[0] ?? doc.date ?? "";
  return {
    id: doc._id.toString(),
    locales,
    pricePerPerson: doc.pricePerPerson,
    date,
    bookableDates,
    isHidden: Boolean(doc.isHidden),
    mainImage: doc.mainImage,
    galleryImages: doc.galleryImages ?? [],
    imageUrl: doc.mainImage,
    createdAt: doc.createdAt?.toISOString() ?? new Date(0).toISOString(),
    updatedAt: doc.updatedAt?.toISOString() ?? new Date(0).toISOString(),
  };
}

type LeanOrder = {
  _id: Types.ObjectId;
  tour: LeanTour | Types.ObjectId | null;
  userName: string;
  userEmail: string;
  numberOfPeople: number;
  totalPrice: number;
  status?: "pending" | "confirmed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
};

function isPopulatedTour(t: LeanTour | Types.ObjectId | null): t is LeanTour {
  return (
    typeof t === "object" &&
    t !== null &&
    "_id" in t &&
    ("locales" in t || "name" in t)
  );
}

export function formatOrder(doc: LeanOrder) {
  const tourRaw = doc.tour;
  const tourId =
    tourRaw == null
      ? ""
      : isPopulatedTour(tourRaw)
        ? tourRaw._id.toString()
        : tourRaw.toString();
  const tour = tourRaw != null && isPopulatedTour(tourRaw) ? formatTour(tourRaw) : undefined;

  return {
    id: doc._id.toString(),
    tourId,
    userName: doc.userName,
    userEmail: doc.userEmail,
    numberOfPeople: doc.numberOfPeople,
    totalPrice: doc.totalPrice,
    status: doc.status ?? "confirmed",
    createdAt: doc.createdAt?.toISOString() ?? new Date(0).toISOString(),
    updatedAt: doc.updatedAt?.toISOString() ?? new Date(0).toISOString(),
    ...(tour ? { tour } : {}),
  };
}
