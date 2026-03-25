import type { Request, Response } from "express";
import mongoose from "mongoose";
import { OrderModel } from "../models/Order";
import { TourModel } from "../models/Tour";
import { ApiError } from "../utils/ApiError";
import { formatOrder } from "../utils/mongoSerialize";

export async function createOrder(req: Request, res: Response) {
  const { tourId, userName, userEmail, numberOfPeople } = req.body as {
    tourId: string;
    userName: string;
    userEmail: string;
    numberOfPeople: number;
  };

  if (!mongoose.isValidObjectId(tourId)) {
    throw new ApiError(400, "Invalid tourId");
  }

  const tour = await TourModel.findById(tourId).lean();
  if (!tour) {
    throw new ApiError(404, "Tour not found");
  }

  const totalPrice = tour.pricePerPerson * numberOfPeople;

  const created = await OrderModel.create({
    tour: new mongoose.Types.ObjectId(tourId),
    userName,
    userEmail,
    numberOfPeople,
    totalPrice,
  });

  const full = await OrderModel.findById(created._id).populate("tour").lean();
  if (!full?.tour || typeof full.tour !== "object" || !("_id" in full.tour)) {
    throw new ApiError(500, "Order could not be loaded after create");
  }
  res.status(201).json(formatOrder(full));
}
