import type { Request, Response } from "express";
import mongoose from "mongoose";
import { TourModel } from "../models/Tour";
import { OrderModel } from "../models/Order";
import { ApiError } from "../utils/ApiError";
import { formatTour } from "../utils/mongoSerialize";

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
  const { name, description, pricePerPerson, date, duration, mainImage, galleryImages } = req.body as {
    name: string;
    description: string;
    pricePerPerson: number;
    date: string;
    duration: string;
    mainImage: string;
    galleryImages?: string[];
  };
  const created = await TourModel.create({
    name,
    description,
    pricePerPerson,
    date,
    duration,
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
  const patch = req.body as Partial<{
    name: string;
    description: string;
    pricePerPerson: number;
    date: string;
    duration: string;
    mainImage: string;
    galleryImages: string[];
  }>;
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
