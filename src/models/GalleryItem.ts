import mongoose from "mongoose";

const galleryItemSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true, maxlength: 2048 },
    title: { type: String, maxlength: 200 },
    description: { type: String, maxlength: 2000 },
  },
  { timestamps: true }
);

export type GalleryItemAttrs = {
  imageUrl: string;
  title?: string;
  description?: string;
};

export const GalleryItemModel = mongoose.model<GalleryItemAttrs>("GalleryItem", galleryItemSchema);
