import { body } from "express-validator";
import { ORDER_STATUSES } from "../models/Order";

export const createOrderRules = [
  body("tourId").isMongoId().withMessage("tourId must be a valid MongoDB ObjectId"),
  body("userName")
    .trim()
    .notEmpty()
    .withMessage("userName is required")
    .isLength({ max: 255 }),
  body("userEmail").trim().isEmail().withMessage("userEmail must be valid").normalizeEmail(),
  body("numberOfPeople")
    .isInt({ min: 1 })
    .withMessage("numberOfPeople must be an integer at least 1"),
];

export const updateOrderStatusRules = [
  body("status")
    .isString()
    .isIn([...ORDER_STATUSES])
    .withMessage(`status must be one of: ${ORDER_STATUSES.join(", ")}`),
];
