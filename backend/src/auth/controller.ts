import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Router } from "express";
import * as joi from "joi";
import { prismaClient } from "../db";
import { BadRequestError } from "../errors/BadRequestError";
import { validate } from "../utils/validate";
import { wrap } from "../utils/wrap";
import { authorize } from "./authorize";
import { User } from "@prisma/client";
import { NotFoundError } from "../errors/NotFoundError";

import { config } from "../config";
const router = Router();
router.post(
  "/login",
  validate(
    "body",
    joi.object({
      password: joi.string().required(),
      phoneNumber: joi.string().required(),
    })
  ),
  wrap(async (req, res) => {
    const user = await getUserOrFail(req.body.phoneNumber);
    const isPasswordValid = await argon2.verify(
      user.password,
      req.body.password
    );

    if (!isPasswordValid) {
      throw new BadRequestError("invalid password");
    }

    const { id: loginId } = await recordLogin(user);
    const token = getToken(user, loginId);

    res.cookie("token", token, {
      secure: config.isProd,
      sameSite: true,
      maxAge: config.jwtExpiration,
      httpOnly: true,
    });
    return res.sendStatus(204);
  })
);

async function recordLogin(user: User): Promise<{ id: string }> {
  return await prismaClient.login.create({
    data: {
      date: new Date(),
      userId: user.id,
      revokedAt: null,
      expiresAt: new Date(Date.now() + config.jwtExpiration),
    },
  });
}

function getToken(user: User, loginId: string) {
  return jwt.sign(
    {
      userId: user.id,
      loginId: loginId,
    },
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    config.secret,
    { expiresIn: config.jwtExpiration + "ms" }
  );
}

async function getUserOrFail(phoneNumber: string) {
  const user = await prismaClient.user.findUnique({
    where: {
      phoneNumber: phoneNumber,
    },
  });
  if (!user) {
    throw new NotFoundError("user not found");
  }
  return user;
}

router.get(
  "/me",
  authorize,
  wrap(async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, phoneNumber, loginId, ...data } = req.user;
    res.json(data);
  })
);

router.post(
  "/logout",
  authorize,
  wrap(async (req, res) => {
    const loginId = req.user.loginId;
    await logout(loginId);
    res.clearCookie("token");
    return res.sendStatus(204);
  })
);

export default router;
async function logout(loginId: string) {
  await prismaClient.login.update({
    where: {
      id: loginId,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}
