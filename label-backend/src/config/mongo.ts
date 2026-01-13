import mongoose from "mongoose";
import { env } from "@config/env";
import { logger } from "@utils/logger";

mongoose.set("strictQuery", true);

export const connectMongo = async (): Promise<typeof mongoose> => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      dbName: env.DB_NAME,
      maxPoolSize: 10,
    });
    logger.info("MongoDB connected", { db: env.DB_NAME });
    return mongoose;
  } catch (error) {
    logger.error("MongoDB connection failed", { error: (error as Error).message });
    throw error;
  }
};

export const disconnectMongo = async (): Promise<void> => {
  await mongoose.disconnect();
};
