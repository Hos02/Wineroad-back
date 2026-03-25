import { body, param } from "express-validator";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

/** `validator.isURL` defaults to require_tld=true, which rejects `http://localhost/...` (no TLD). */
const tourImageUrlOptions = {
  require_tld: false,
  protocols: ["http", "https"],
};

export const tourIdParam = [
  param("id").isMongoId().withMessage("id must be a valid MongoDB ObjectId"),
];

export const createTourRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ max: 255 })
    .withMessage("name is too long"),
  body("description").trim().notEmpty().withMessage("description is required"),
  body("pricePerPerson")
    .isFloat({ gt: 0 })
    .withMessage("pricePerPerson must be a number greater than 0"),
  body("date")
    .trim()
    .matches(isoDateRegex)
    .withMessage("date must be YYYY-MM-DD"),
  body("duration")
    .trim()
    .notEmpty()
    .withMessage("duration is required")
    .isLength({ max: 128 })
    .withMessage("duration is too long"),
  body("mainImage")
    .trim()
    .notEmpty()
    .withMessage("mainImage is required")
    .isURL(tourImageUrlOptions)
    .withMessage("mainImage must be a valid URL"),
  body("galleryImages")
    .optional()
    .isArray()
    .withMessage("galleryImages must be an array"),
  body("galleryImages.*")
    .optional()
    .trim()
    .isURL(tourImageUrlOptions)
    .withMessage("Each gallery image must be a valid URL"),
];

export const updateTourRules = [
  ...tourIdParam,
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("name cannot be empty")
    .isLength({ max: 255 }),
  body("description").optional().trim().notEmpty().withMessage("description cannot be empty"),
  body("pricePerPerson")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("pricePerPerson must be greater than 0"),
  body("date")
    .optional()
    .trim()
    .matches(isoDateRegex)
    .withMessage("date must be YYYY-MM-DD"),
  body("duration")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("duration cannot be empty")
    .isLength({ max: 128 }),
  body("mainImage")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("mainImage cannot be empty")
    .isURL(tourImageUrlOptions)
    .withMessage("mainImage must be a valid URL"),
  body("galleryImages")
    .optional()
    .isArray()
    .withMessage("galleryImages must be an array"),
  body("galleryImages.*")
    .optional()
    .trim()
    .isURL(tourImageUrlOptions)
    .withMessage("Each gallery image must be a valid URL"),
];
