import { Router } from "express";
import * as toursController from "../controllers/tours.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAdmin } from "../middleware/requireAdmin";
import { handleValidationErrors } from "../middleware/validate";
import {
  createTourRules,
  tourIdParam,
  updateTourRules,
} from "../validators/tourValidators";

const router = Router();

router.get("/", asyncHandler(toursController.listTours));
router.get(
  "/:id",
  tourIdParam,
  handleValidationErrors,
  asyncHandler(toursController.getTourById)
);
router.post(
  "/",
  requireAdmin,
  createTourRules,
  handleValidationErrors,
  asyncHandler(toursController.createTour)
);
router.put(
  "/:id",
  requireAdmin,
  updateTourRules,
  handleValidationErrors,
  asyncHandler(toursController.updateTour)
);
router.delete(
  "/:id",
  requireAdmin,
  tourIdParam,
  handleValidationErrors,
  asyncHandler(toursController.deleteTour)
);

export default router;
