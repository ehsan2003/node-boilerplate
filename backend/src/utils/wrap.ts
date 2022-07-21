import { RequestHandler } from "express";

export function wrap(middleware: RequestHandler): RequestHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req, res, next) => (middleware(req, res, next) as any).catch(next);
}
