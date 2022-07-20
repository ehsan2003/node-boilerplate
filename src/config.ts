/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const config: Config = {
  port: +process.env.PORT!,
  secret: process.env.SECRET_KEY!,
  jwtExpiration: +process.env.JWT_EXPIRATION!,
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
};
export type Config = {
  port: number;
  secret: string;
  jwtExpiration: number;
  isDev: boolean;
  isProd: boolean;
};
