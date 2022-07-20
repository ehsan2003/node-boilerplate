import { BaseError } from "./BaseError";

export class UnAuthorizedError extends BaseError {
  getStatus(): number {
    return 401;
  }
  intoResponse() {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
}
