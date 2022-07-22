/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

/**
 * @type {import('@prisma/client').PrismaClient}
 */
const PrismaClient = require("@prisma/client").PrismaClient;
const c = new PrismaClient();

c.user
  .create({
    data: {
      name: "ziya",
      lastName: "emami",
      password:
        "$argon2id$v=19$m=4096,t=3,p=1$A/DQGMlKhNUjGJUr15B4bw$F4wRiLemQymYkDtJVX9PLQpNpx1hKgj4caDeGq0HiLY",
      phoneNumber: "+989126723365",
      role: "Teacher",
      Teacher: {
        create: {
          isAdmin: true,
        },
      },
    },
  })
  .then(console.log);
