import { body, param } from "express-validator";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

/** `validator.isURL` defaults to require_tld=true, which rejects `http://localhost/...` (no TLD). */
const tourImageUrlOptions = {
  require_tld: false,
  protocols: ["http", "https"],
};

const localeKeys = ["en", "ru", "am"] as const;

function localeCreateRules(prefix: (typeof localeKeys)[number]) {
  return [
    body(`locales.${prefix}.title`)
      .trim()
      .notEmpty()
      .withMessage(`${prefix}.title is required`)
      .isLength({ max: 255 })
      .withMessage(`${prefix}.title is too long`),
    body(`locales.${prefix}.description`)
      .trim()
      .notEmpty()
      .withMessage(`${prefix}.description is required`),
    body(`locales.${prefix}.duration`)
      .trim()
      .notEmpty()
      .withMessage(`${prefix}.duration is required`)
      .isLength({ max: 128 })
      .withMessage(`${prefix}.duration is too long`),
  ];
}

export const tourIdParam = [
  param("id").isMongoId().withMessage("id must be a valid MongoDB ObjectId"),
];

export const createTourRules = [
  ...localeKeys.flatMap((k) => localeCreateRules(k)),
  body("pricePerPerson")
    .isFloat({ gt: 0 })
    .withMessage("pricePerPerson must be a number greater than 0"),
  body("date")
    .trim()
    .matches(isoDateRegex)
    .withMessage("date must be YYYY-MM-DD"),
  body("isHidden")
    .optional()
    .isBoolean()
    .withMessage("isHidden must be a boolean"),
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
  ...localeKeys.flatMap((prefix) => [
    body(`locales.${prefix}.title`)
      .optional()
      .trim()
      .notEmpty()
      .withMessage(`${prefix}.title cannot be empty`)
      .isLength({ max: 255 })
      .withMessage(`${prefix}.title is too long`),
    body(`locales.${prefix}.description`)
      .optional()
      .trim()
      .notEmpty()
      .withMessage(`${prefix}.description cannot be empty`),
    body(`locales.${prefix}.duration`)
      .optional()
      .trim()
      .notEmpty()
      .withMessage(`${prefix}.duration cannot be empty`)
      .isLength({ max: 128 })
      .withMessage(`${prefix}.duration is too long`),
  ]),
  body("pricePerPerson")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("pricePerPerson must be greater than 0"),
  body("date")
    .optional()
    .trim()
    .matches(isoDateRegex)
    .withMessage("date must be YYYY-MM-DD"),
  body("isHidden")
    .optional()
    .isBoolean()
    .withMessage("isHidden must be a boolean"),
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
