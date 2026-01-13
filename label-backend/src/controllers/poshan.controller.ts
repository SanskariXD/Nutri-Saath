import type { Request, Response, NextFunction } from "express";
import { poshanService } from "@services/poshan/poshan.service";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      auth?: {
        uid: string;
        email: string;
      };
    }
  }
}

export const getPoshanSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await poshanService.getSummary(req.auth!.uid);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

