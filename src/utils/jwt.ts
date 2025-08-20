import jwt from "jsonwebtoken";

const ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET || "supersecret";
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || "superdupersecret";

export const accessToken = (userId: number) => {
  return jwt.sign({ userId }, ACCESS_SECRET_KEY, { expiresIn: "1h" });
};
export const refreshToken = (userId: number) => {
  return jwt.sign({ userId }, REFRESH_SECRET_KEY, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET_KEY);
};
