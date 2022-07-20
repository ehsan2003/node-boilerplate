import { BadRequestError } from "../errors/BadRequestError";
import { NextFunction, Request, Response } from "express";
import * as Joi from "joi";

export function validate(
  name: "query" | "body" | "params",
  schema: Joi.Schema
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const bareValue = req[name];
    const { error, value } = schema.validate(bareValue);
    if (error) {
      next(new BadRequestError("invalid input", error));
    }
    req[name] = value;
    next();
  };
}

export const validatePagination = (maxLimit = 50, defaultLimit = 10) =>
  validate(
    "query",
    Joi.object({
      skip: Joi.number().integer().min(0).default(0),
      limit: Joi.number().integer().min(1).max(maxLimit).default(defaultLimit),
    }).options({ allowUnknown: true })
  );

export const passwordValidator = Joi.string().pattern(/\w/).min(8).max(100);
