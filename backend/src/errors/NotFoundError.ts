import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
  getStatus() {
    return 404;
  }

  intoResponse() {
    return {
      message: this.message,
    };
  }
}
