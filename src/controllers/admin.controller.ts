import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { OrderModel } from "../models/Order";
import { TourModel } from "../models/Tour";
import { ApiError } from "../utils/ApiError";
import { formatOrder } from "../utils/mongoSerialize";

export async function adminLogin(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const jwtSecret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN ?? "7d";

  if (!adminEmail || !jwtSecret) {
    throw new ApiError(500, "Admin login is not configured on the server");
  }
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  if (email.trim().toLowerCase() !== adminEmail.toLowerCase()) {
    throw new ApiError(401, "Invalid credentials");
  }

  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
  let valid = false;
  if (hash) {
    valid = await bcrypt.compare(password, hash);
  } else {
    const plain = process.env.ADMIN_PASSWORD;
    if (!plain) {
      throw new ApiError(500, "Admin password is not configured");
    }
    valid = password === plain;
  }

  if (!valid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign({ sub: "admin", role: "admin" }, jwtSecret, {
    expiresIn,
  } as jwt.SignOptions);

  res.json({ token, expiresIn, role: "admin" as const });
}

export async function listOrdersAdmin(_req: Request, res: Response) {
  const docs = await OrderModel.find().populate("tour").sort({ createdAt: -1 }).lean();
  res.json(docs.map((d) => formatOrder(d)));
}

export async function adminStats(_req: Request, res: Response) {
  const tourCount = await TourModel.countDocuments();
  const orderCount = await OrderModel.countDocuments();
  const agg = await OrderModel.aggregate<{ total: number }>([
    { $match: { status: "confirmed" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const revenueTotal = agg[0]?.total ?? 0;
  res.json({ tourCount, orderCount, revenueTotal });
}

export async function updateOrderStatusAdmin(req: Request, res: Response) {
  const id = req.params.id;
  const { status } = req.body as { status: "pending" | "confirmed" | "cancelled" };
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid order id");
  }

  const updated = await OrderModel.findByIdAndUpdate(
    id,
    { status },
    { returnDocument: "after", runValidators: true }
  )
    .populate("tour")
    .lean();

  if (!updated) {
    throw new ApiError(404, "Order not found");
  }
  res.json(formatOrder(updated));
}
