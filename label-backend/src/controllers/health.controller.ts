import type { Request, Response } from "express";
import { env } from "@config/env";
import mongoose from "mongoose";

export const healthCheck = (_req: Request, res: Response) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({ 
    status: "ok", 
    uptime: process.uptime(), 
    commit: env.RELEASE_SHA,
    mongo: mongoStatus
  });
};

export const debugPing = (_req: Request, res: Response) => {
  res.json({ pong: true, time: new Date().toISOString() });
};

