import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const saltRounds = 10;

export const hashPassword = async (
  password: string,
): Promise<string | null> => {
  if (!password) return null;
  return await bcrypt.hash(password, saltRounds);
};

export const validatePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  if (!password || !hashedPassword) return false;
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userData: object): string => {
  return jwt.sign(userData, process.env.JWT_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userData: object): string => {
  return jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d",
  });
};

export const jwtVerify = (token: string): object | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as object;
  } catch {
    return null;
  }
};

export function verifyRefreshToken(token: string): object | null {
  try {
    return jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as object;
  } catch {
    return null;
  }
}
