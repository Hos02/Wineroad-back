import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const token = header.slice("Bearer ".length).trim();
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new ApiError(500, "Server authentication is not configured"));
  }

  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload & { role?: string };
    if (decoded.role !== "admin") {
      return next(new ApiError(403, "Admin access required"));
    }
    req.admin = { sub: String(decoded.sub ?? ""), role: decoded.role };
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
}
