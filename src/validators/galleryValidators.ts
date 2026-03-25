import { body, param } from "express-validator";

/** Same as tour images — allows `http://localhost/...` for local dev. */
const imageUrlOptions = {
  require_tld: false,
  protocols: ["http", "https"],
};

export const galleryIdParam = [
  param("id").isMongoId().withMessage("id must be a valid MongoDB ObjectId"),
];

export const createGalleryRules = [
  body("imageUrl")
    .trim()
    .notEmpty()
    .withMessage("imageUrl is required")
    .isURL(imageUrlOptions)
    .withMessage("imageUrl must be a valid http(s) URL"),
  body("title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("title is too long"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("description is too long"),
];
