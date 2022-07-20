export abstract class BaseError extends Error {
  abstract getStatus(): number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract intoResponse(): any;
}
