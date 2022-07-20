import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./errorHandler";
import authRouter from "./auth/controller";

const app = express();
app.use(cookieParser(process.env.SECRET_KEY));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use(errorHandler);
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
app.listen(process.env.PORT!, () => {
  console.log("server is running");
});
