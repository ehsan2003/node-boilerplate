/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
  protected data?: any;

  constructor(public message: string, data?: any) {
    super(message);
    this.data = data;
  }

  getStatus() {
    return 400;
  }

  intoResponse() {
    return { message: this.message, data: this.data };
  }
}
