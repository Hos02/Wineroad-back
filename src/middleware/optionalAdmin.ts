import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function optionalAdmin(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next();
  }

  const token = header.slice("Bearer ".length).trim();
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload & { role?: string };
    if (decoded.role === "admin") {
      req.admin = { sub: String(decoded.sub ?? ""), role: decoded.role };
    }
  } catch {
    // Ignore invalid token on public routes.
  }
  next();
}
