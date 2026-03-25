import { Router } from "express";
import * as galleryController from "../controllers/gallery.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAdmin } from "../middleware/requireAdmin";
import { handleValidationErrors } from "../middleware/validate";
import {
  createGalleryRules,
  galleryIdParam,
} from "../validators/galleryValidators";

const router = Router();

router.get("/", asyncHandler(galleryController.listGallery));
router.post(
  "/",
  requireAdmin,
  createGalleryRules,
  handleValidationErrors,
  asyncHandler(galleryController.createGalleryItem)
);
router.delete(
  "/:id",
  requireAdmin,
  galleryIdParam,
  handleValidationErrors,
  asyncHandler(galleryController.deleteGalleryItem)
);

export default router;
