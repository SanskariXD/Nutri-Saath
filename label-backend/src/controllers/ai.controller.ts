import type { Request, Response, NextFunction } from "express";
import { geminiClient } from "@services/gemini/gemini.client";
import { AppError } from "@shared/errors";
import { env } from "@config/env";

export const sendAiMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message } = req.body as { message: string };
    
    if (!env.GEMINI_API_KEY) {
      return res.status(503).json({ 
        error: "Gemini disabled",
        message: "AI chat service is not configured"
      });
    }

    const prompt = `You are Nutri Saath, a friendly nutrition and lifestyle assistant. 
Provide helpful, evidence-backed guidance about food, nutrition, and healthy living.
Keep responses concise and practical. Focus on Indian dietary habits and cultural context when relevant.
Be encouraging and supportive in your tone.

User question: ${message}`;

    try {
      const reply = await geminiClient.generateText(prompt, {
        temperature: 0.7,
      });

      res.json({ 
        reply,
        success: true 
      });
    } catch (err: any) {
      // Surface Gemini error message to client in development for debugging
      const status = err?.statusCode || err?.status || 500;
      const message = err?.message || 'AI service error';
      if (process.env.NODE_ENV !== 'production') {
        return res.status(500).json({ error: { message } });
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
};
