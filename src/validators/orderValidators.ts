import { body } from "express-validator";

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
