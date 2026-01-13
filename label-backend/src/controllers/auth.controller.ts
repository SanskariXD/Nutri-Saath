import type { Request, Response, NextFunction } from "express";
import { authService } from "@services/auth/auth.service";

export const googleAuthController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idToken } = req.body as { idToken: string };
    const result = await authService.authenticateWithGoogle(idToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

