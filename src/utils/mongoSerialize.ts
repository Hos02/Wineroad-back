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

export function formatTour(doc: LeanTour) {
  const locales = normalizeLocales(doc);
  return {
    id: doc._id.toString(),
    locales,
    pricePerPerson: doc.pricePerPerson,
    date: doc.date,
    mainImage: doc.mainImage,
    galleryImages: doc.galleryImages ?? [],
    imageUrl: doc.mainImage,
    createdAt: doc.createdAt?.toISOString() ?? new Date(0).toISOString(),
    updatedAt: doc.updatedAt?.toISOString() ?? new Date(0).toISOString(),
  };
}

type LeanOrder = {
  _id: Types.ObjectId;
  tour: LeanTour | Types.ObjectId;
  userName: string;
  userEmail: string;
  numberOfPeople: number;
  totalPrice: number;
  createdAt?: Date;
};

function isPopulatedTour(t: LeanTour | Types.ObjectId): t is LeanTour {
  return typeof t === "object" && t !== null && "_id" in t && ("locales" in t || "name" in t);
}

export function formatOrder(doc: LeanOrder) {
  const tourRaw = doc.tour;
  const tourId = isPopulatedTour(tourRaw) ? tourRaw._id.toString() : tourRaw.toString();
  const tour = isPopulatedTour(tourRaw) ? formatTour(tourRaw) : undefined;

  return {
    id: doc._id.toString(),
    tourId,
    userName: doc.userName,
    userEmail: doc.userEmail,
    numberOfPeople: doc.numberOfPeople,
    totalPrice: doc.totalPrice,
    createdAt: doc.createdAt?.toISOString() ?? new Date(0).toISOString(),
    ...(tour ? { tour } : {}),
  };
}
