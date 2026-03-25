import type { Types } from "mongoose";

type LeanTour = {
  _id: Types.ObjectId;
  name: string;
  description: string;
  pricePerPerson: number;
  date: string;
  duration: string;
  mainImage: string;
  galleryImages?: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export function formatTour(doc: LeanTour) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    pricePerPerson: doc.pricePerPerson,
    date: doc.date,
    duration: doc.duration,
    mainImage: doc.mainImage,
    galleryImages: doc.galleryImages ?? [],
    // Backward compatibility for older clients.
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
  return typeof t === "object" && t !== null && "_id" in t && "name" in t;
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
