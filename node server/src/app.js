import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import cookieParser from "cookie-parser";

import { passport } from "./config/passport.js";
import { ensureAuthenticated } from "./middlewares/auth.middleware.js";

import { globalErrorHandler } from "../src/utils/globalErrorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
    credentials: true,
  }),
);

app.set("trust proxy", 1);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_DB_URL }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: true,
      sameSite: "none",
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);

app.use(globalErrorHandler);

export { app };
