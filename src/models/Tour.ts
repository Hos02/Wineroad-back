import mongoose from "mongoose";

const localeBlockSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", maxlength: 255 },
    description: { type: String, default: "" },
    duration: { type: String, default: "", maxlength: 128 },
  },
  { _id: false }
);

const tourSchema = new mongoose.Schema(
  {
    locales: {
      en: { type: localeBlockSchema, default: () => ({}) },
      ru: { type: localeBlockSchema, default: () => ({}) },
      am: { type: localeBlockSchema, default: () => ({}) },
    },
    /** @deprecated Legacy single-locale fields; use `locales` only for new tours. */
    name: { type: String },
    description: { type: String },
    duration: { type: String },
    pricePerPerson: { type: Number, required: true },
    /** Earliest bookable day (kept in sync with `bookableDates` for older clients). */
    date: { type: String, required: true },
    /** Admin-defined calendar days when this tour can be booked (YYYY-MM-DD). */
    bookableDates: { type: [String], default: [] },
    /** Hidden tours are excluded from public website listings/details. */
    isHidden: { type: Boolean, default: false },
    mainImage: { type: String, required: true },
    galleryImages: { type: [String], default: [] },
  },
  { timestamps: true }
);

export type TourLocaleBlock = {
  title: string;
  description: string;
  duration: string;
};

export type TourLocales = {
  en: TourLocaleBlock;
  ru: TourLocaleBlock;
  am: TourLocaleBlock;
};

export type TourAttrs = {
  locales: TourLocales;
  pricePerPerson: number;
  date: string;
  bookableDates: string[];
  isHidden: boolean;
  mainImage: string;
  galleryImages: string[];
};

export const TourModel = mongoose.model<TourAttrs>("Tour", tourSchema);
