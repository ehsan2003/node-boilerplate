import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { Request, RequestHandler } from "express";
import { UnAuthorizedError } from "../errors/UnAuthorizedError";
import { wrap } from "../utils/wrap";
import { prismaClient } from "../db";
import { AuthPayload } from "../utils/AuthPayload";
import { config } from "../config";

export const authorize: RequestHandler = wrap(async (req, res, next) => {
  const token = extractToken(req);
  const authPayload = verifyToken(token);
  await verifyLogin(authPayload.loginId);
  const user = await getUser(authPayload);
  req.user = user;
  next();
});

async function getUser(decoded: AuthPayload) {
  const user = await prismaClient.user.findUnique({
    where: {
      id: decoded.userId,
    },
  });
  if (!user) {
    throw new UnAuthorizedError("invalid auth");
  }
  return user;
}

function extractToken(req: Request) {
  const token = req.cookies.token;

  if (!token) {
    throw new UnAuthorizedError("invalid auth");
  }
  return token;
}

async function verifyLogin(loginId: string) {
  const login = await prismaClient.login.findUnique({
    where: {
      id: loginId,
    },
  });
  if (!login) {
    throw new UnAuthorizedError("invalid auth");
  }
  if (login.revokedAt) {
    throw new UnAuthorizedError("invalid auth");
  }
}
function verifyToken(token: string): AuthPayload {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded = jwt.verify(token, config.secret) as any;
    return decoded;
  } catch (err) {
    if (err instanceof JsonWebTokenError)
      throw new UnAuthorizedError("invalid auth");
    throw err;
  }
}
