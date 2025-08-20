import express from "express";
import cors from "cors";
import helmet from "helmet";

import itemRoutes from "./routes/itemRoutes.ts";
import authRoutes from "./routes/authRoutes.ts";

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

// 라우터 등록
app.use("/api", itemRoutes);
app.use("/auth", authRoutes);

export default app;
