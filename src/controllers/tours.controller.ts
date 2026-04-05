import type { Request, Response } from "express";
import mongoose from "mongoose";
import { TourModel } from "../models/Tour";
import type { TourLocaleBlock, TourLocales } from "../models/Tour";
import { OrderModel } from "../models/Order";
import { ApiError } from "../utils/ApiError";
import { formatTour } from "../utils/mongoSerialize";

function mergeBlock(
  base: TourLocaleBlock | undefined,
  patch: Partial<TourLocaleBlock> | undefined
): TourLocaleBlock {
  const empty: TourLocaleBlock = { title: "", description: "", duration: "" };
  return { ...empty, ...base, ...patch };
}

function mergeLocales(
  existing: TourLocales | undefined,
  patch: Partial<TourLocales> | undefined
): TourLocales | undefined {
  if (!patch) return undefined;
  return {
    en: mergeBlock(existing?.en, patch.en),
    ru: mergeBlock(existing?.ru, patch.ru),
    am: mergeBlock(existing?.am, patch.am),
  };
}

export async function listTours(_req: Request, res: Response) {
  const docs = await TourModel.find().sort({ createdAt: 1 }).lean();
  res.json(docs.map((d) => formatTour(d)));
}

export async function getTourById(req: Request, res: Response) {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid tour id");
  }
  const tour = await TourModel.findById(id).lean();
  if (!tour) {
    throw new ApiError(404, "Tour not found");
  }
  res.json(formatTour(tour));
}

export async function createTour(req: Request, res: Response) {
  const { locales, pricePerPerson, date, mainImage, galleryImages } = req.body as {
    locales: TourLocales;
    pricePerPerson: number;
    date: string;
    mainImage: string;
    galleryImages?: string[];
  };
  const created = await TourModel.create({
    locales,
    pricePerPerson,
    date,
    mainImage,
    galleryImages: galleryImages ?? [],
  });
  const tour = await TourModel.findById(created._id).lean();
  if (!tour) {
    throw new ApiError(500, "Tour could not be loaded after create");
  }
  res.status(201).json(formatTour(tour));
}

export async function updateTour(req: Request, res: Response) {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid tour id");
  }
  const body = req.body as Partial<{
    locales: Partial<TourLocales>;
    pricePerPerson: number;
    date: string;
    mainImage: string;
    galleryImages: string[];
  }>;

  let patch: Record<string, unknown> = { ...body };
  if (body.locales) {
    const existing = await TourModel.findById(id).lean();
    if (!existing) {
      throw new ApiError(404, "Tour not found");
    }
    const merged = mergeLocales(existing.locales as TourLocales | undefined, body.locales);
    if (merged) {
      patch = { ...patch, locales: merged };
    }
  }

  const updated = await TourModel.findByIdAndUpdate(id, patch, {
    returnDocument: "after",
    runValidators: true,
  }).lean();
  if (!updated) {
    throw new ApiError(404, "Tour not found");
  }
  res.json(formatTour(updated));
}

export async function deleteTour(req: Request, res: Response) {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid tour id");
  }
  const blockingOrders = await OrderModel.countDocuments({ tour: id });
  if (blockingOrders > 0) {
    throw new ApiError(
      409,
      "Cannot delete tour with existing orders. Remove or reassign orders first."
    );
  }
  const result = await TourModel.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(404, "Tour not found");
  }
  res.status(204).send();
}
