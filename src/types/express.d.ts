/// <reference types="express" />

declare global {
  namespace Express {
    interface Request {
      admin?: { sub: string; role: string };
    }
  }
}

export {};
