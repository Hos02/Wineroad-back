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

function getCorsOrigin(): boolean | string[] {
  const raw = process.env.CORS_ORIGINS?.trim();
  if (!raw) {
    return true;
  }
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length ? list : true;
}

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: getCorsOrigin(),
      credentials: true,
    })
  );
  app.use(express.json());
  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // All /admin/* routes on the main app — avoid `app.use("/admin", router)` with Express 5 (it can swallow POST /admin/login).
  app.get("/admin/ping", (_req, res) => {
    res.json({ ok: true, service: "wineroad-api" });
  });
  app.post(
    "/admin/login",
    adminLoginRules,
    handleValidationErrors,
    asyncHandler(adminController.adminLogin)
  );
  app.get("/admin/orders", requireAdmin, asyncHandler(adminController.listOrdersAdmin));
  app.get("/admin/stats", requireAdmin, asyncHandler(adminController.adminStats));
  app.post(
    "/admin/upload-image",
    requireAdmin,
    uploadTourImage.single("image"),
    asyncHandler(async (req, res) => uploadController.uploadTourImage(req, res))
  );

  app.use("/tours", toursRoutes);
  app.use("/orders", ordersRoutes);
  app.use("/gallery", galleryRoutes);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use(errorHandler);

  return app;
}
