import cors from "cors";
import express from "express";
import path from "path";
import * as adminController from "./controllers/admin.controller";
import * as uploadController from "./controllers/upload.controller";
import { errorHandler } from "./middleware/errorHandler";
import { asyncHandler } from "./middleware/asyncHandler";
import { requireAdmin } from "./middleware/requireAdmin";
import { uploadTourImage } from "./middleware/uploadImage";
import { handleValidationErrors } from "./middleware/validate";
import galleryRoutes from "./routes/gallery.routes";
import ordersRoutes from "./routes/orders.routes";
import toursRoutes from "./routes/tours.routes";
import { adminLoginRules } from "./validators/adminValidators";
import { updateOrderStatusRules } from "./validators/orderValidators";

/**
 * Parse CORS origins from env
 */
function getCorsOrigins(): string[] | null {
  const raw = process.env.CORS_ORIGINS?.trim();
  if (!raw) return null;

  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function createApp() {
  const app = express();

  const allowedOrigins = getCorsOrigins();
  const corsAllowAll =
    process.env.CORS_ALLOW_ALL === "true" || process.env.CORS_ALLOW_ALL === "1";

  if (corsAllowAll) {
    console.warn(
      "[CORS] CORS_ALLOW_ALL is enabled — all browser origins are allowed. Turn this off for production."
    );
  }

  app.use(
    corsAllowAll
      ? cors({ origin: true, credentials: true })
      : cors({
          origin: (origin, callback) => {
            console.log("🔥 Incoming origin:", origin);

            if (!origin) return callback(null, true);

            if (!allowedOrigins) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
              return callback(null, true);
            }

            console.error("❌ Blocked by CORS:", origin);
            return callback(new Error("Not allowed by CORS"));
          },
          credentials: true,
        })
  );

  app.use(express.json());

  app.use(
    "/uploads",
    express.static(path.resolve(process.cwd(), "uploads"))
  );

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Admin routes
  app.get("/admin/ping", (_req, res) => {
    res.json({ ok: true, service: "wineroad-api" });
  });

  app.post(
    "/admin/login",
    adminLoginRules,
    handleValidationErrors,
    asyncHandler(adminController.adminLogin)
  );

  app.get(
    "/admin/orders",
    requireAdmin,
    asyncHandler(adminController.listOrdersAdmin)
  );

  app.patch(
    "/admin/orders/:id/status",
    requireAdmin,
    updateOrderStatusRules,
    handleValidationErrors,
    asyncHandler(adminController.updateOrderStatusAdmin)
  );

  app.get(
    "/admin/stats",
    requireAdmin,
    asyncHandler(adminController.adminStats)
  );

  app.post(
    "/admin/upload-image",
    requireAdmin,
    uploadTourImage.single("image"),
    asyncHandler(async (req, res) =>
      uploadController.uploadTourImage(req, res)
    )
  );

  // Public routes
  app.use("/tours", toursRoutes);
  app.use("/orders", ordersRoutes);
  app.use("/gallery", galleryRoutes);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use(errorHandler);

  return app;
}