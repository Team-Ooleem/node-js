import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import itemRoutes from "./routes/itemRoutes.ts";
import authRoutes from "./routes/authRoutes.ts";
import { corsOptions } from "./middleware/cors.ts";

const app = express();

app.use(corsOptions);
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

// 라우터 등록
app.use("/api", itemRoutes);
app.use("/auth", authRoutes);

export default app;
