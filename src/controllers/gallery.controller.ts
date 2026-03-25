import type { Request, Response } from "express";
import mongoose from "mongoose";
import { GalleryItemModel } from "../models/GalleryItem";
import { ApiError } from "../utils/ApiError";
import { formatGalleryItem } from "../utils/gallerySerialize";

export async function listGallery(_req: Request, res: Response) {
  const docs = await GalleryItemModel.find().sort({ createdAt: -1 }).lean();
  res.json(docs.map((d) => formatGalleryItem(d)));
}

export async function createGalleryItem(req: Request, res: Response) {
  const { imageUrl, title, description } = req.body as {
    imageUrl: string;
    title?: string;
    description?: string;
  };
  const created = await GalleryItemModel.create({
    imageUrl: imageUrl.trim(),
    ...(title !== undefined && title.trim() !== "" ? { title: title.trim() } : {}),
    ...(description !== undefined && description.trim() !== ""
      ? { description: description.trim() }
      : {}),
  });
  const doc = await GalleryItemModel.findById(created._id).lean();
  if (!doc) {
    throw new ApiError(500, "Gallery item could not be loaded after create");
  }
  res.status(201).json(formatGalleryItem(doc));
}

export async function deleteGalleryItem(req: Request, res: Response) {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid gallery id");
  }
  const result = await GalleryItemModel.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(404, "Gallery item not found");
  }
  res.status(204).send();
}
