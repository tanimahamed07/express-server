import jwt from "jsonwebtoken"; // আপনার প্রজেক্টের সঠিক পাথ অনুযায়ী
import type { ROLES } from "../types";
import config from "../config/env";

export type TJwtPayload = {
  id: number;
  name: string;
  role: ROLES;
  is_active: boolean;
  email: string;
};

// টোকেন জেনারেট করার কমন ফাংশন
export const generateTokens = (payload: TJwtPayload) => {
  const accessToken = jwt.sign(payload, config.secret as string, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign(payload, config.refresh_secret as string, {
    expiresIn: "7d", 
  });

  return { accessToken, refreshToken };
};