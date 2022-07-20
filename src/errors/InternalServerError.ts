/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseError } from "./BaseError";

export class InternalServerError extends BaseError {
  private sourceError: any;

  constructor(sourceError: any) {
    super("Internal server error");
    this.sourceError = sourceError;
  }

  getSource() {
    return this.sourceError;
  }

  getStatus() {
    return 500;
  }

  intoResponse() {
    return {
      message: "internal server error",
    };
  }
}
