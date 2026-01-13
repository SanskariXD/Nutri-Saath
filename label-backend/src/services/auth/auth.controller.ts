import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";

export const googleAuthController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idToken } = req.body;
    const result = await authService.authenticateWithGoogle(idToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
