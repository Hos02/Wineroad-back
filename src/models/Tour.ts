import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 255 },
    description: { type: String, required: true },
    pricePerPerson: { type: Number, required: true },
    date: { type: String, required: true },
    duration: { type: String, required: true, maxlength: 128 },
    mainImage: { type: String, required: true },
    galleryImages: { type: [String], default: [] },
  },
  { timestamps: true }
);

export type TourAttrs = {
  name: string;
  description: string;
  pricePerPerson: number;
  date: string;
  duration: string;
  mainImage: string;
  galleryImages: string[];
};

export const TourModel = mongoose.model<TourAttrs>("Tour", tourSchema);
