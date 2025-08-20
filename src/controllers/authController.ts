import type { Request, Response } from "express";

import pool from "../config/db.ts";
import { accessToken, refreshToken } from "../utils/jwt.ts";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(
      //"SELECT * FROM user WHERE username = ? AND password = SHA2(?, 256)",
      "SELECT * FROM user WHERE username = ?",
      [username]
    );
    const user = (rows as any)[0];

    if (!user) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    const token = accessToken(user.user_id);

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "로그인 실패", error });
  }
};
