import type { Types } from "mongoose";

type LeanGalleryItem = {
  _id: Types.ObjectId;
  imageUrl: string;
  title?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export function formatGalleryItem(doc: LeanGalleryItem) {
  return {
    id: doc._id.toString(),
    imageUrl: doc.imageUrl,
    title: doc.title ?? "",
    description: doc.description ?? "",
    createdAt: doc.createdAt?.toISOString() ?? new Date(0).toISOString(),
    updatedAt: doc.updatedAt?.toISOString() ?? new Date(0).toISOString(),
  };
}
