/* eslint-disable @typescript-eslint/no-explicit-any */
import { InternalServerError } from "./errors/InternalServerError";
import { BaseError } from "./errors/BaseError";
import { ErrorRequestHandler } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof BaseError) {
    res.status(err.getStatus()).json(err.intoResponse());
  } else {
    if (
      err instanceof SyntaxError &&
      "status" in err &&
      (err as any).status === 400 &&
      "body" in err
    ) {
      return res
        .status(400)
        .send({ status: 400, message: (err as any).message }); // Bad request
    }
    res.status(500).json(new InternalServerError(err).intoResponse());
    console.error(err);

    // process.exit(1);
  }
};
