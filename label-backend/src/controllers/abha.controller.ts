import type { Request, Response, NextFunction } from "express";
import { abhaService } from "@services/abha/abha.service";

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

export const linkAbha = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await abhaService.beginLink(req.auth!.uid, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getAbhaStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await abhaService.getStatus(req.auth!.uid);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

