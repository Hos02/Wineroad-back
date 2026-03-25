import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export function uploadTourImage(req: Request, res: Response) {
  if (!req.file) {
    throw new ApiError(400, "Image file is required");
  }

  const explicitBase = process.env.PUBLIC_API_BASE_URL?.trim();
  const fallbackBase = `${req.protocol}://${req.get("host")}`;
  const base = (explicitBase && explicitBase.replace(/\/$/, "")) || fallbackBase;
  const url = `${base}/uploads/tours/${req.file.filename}`;

  res.status(201).json({ url });
}

