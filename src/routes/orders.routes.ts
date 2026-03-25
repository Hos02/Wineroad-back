import { Router } from "express";
import * as ordersController from "../controllers/orders.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { handleValidationErrors } from "../middleware/validate";
import { createOrderRules } from "../validators/orderValidators";

const router = Router();

router.post(
  "/",
  createOrderRules,
  handleValidationErrors,
  asyncHandler(ordersController.createOrder)
);

export default router;
