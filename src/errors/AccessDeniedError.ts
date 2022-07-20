import { BaseError } from "./BaseError";

export class AccessDeniedError extends BaseError {
  getStatus() {
    return 403;
  }

  intoResponse() {
    return {
      message: this.message,
    };
  }
}
