import type { RequestHandler } from "express";
import type { AnyZodObject, ZodEffects } from "zod";

export const validate = <Schema extends AnyZodObject | ZodEffects<AnyZodObject>>(
  schema: Schema,
  target: "body" | "query" | "params" = "body",
): RequestHandler => async (req, _res, next) => {
  try {
    const result = await schema.parseAsync(req[target]);
    req[target] = result;
    return next();
  } catch (error) {
    return next(error);
  }
};

