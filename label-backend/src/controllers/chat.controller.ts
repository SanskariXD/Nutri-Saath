import type { Request, Response, NextFunction } from "express";
import { chatService } from "@services/chat/chat.service";

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

export const sendChatMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, sessionId } = req.body as { message: string; sessionId?: string };
    const result = await chatService.sendMessage({
      userId: req.auth!.uid,
      message,
      sessionId,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

