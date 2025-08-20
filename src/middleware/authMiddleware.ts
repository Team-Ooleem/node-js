import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.ts";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "토큰이 없습니다." });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token!);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};
