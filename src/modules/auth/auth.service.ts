import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config/env";
import { generateTokens, type TJwtPayload } from "./token.utils"; // ইমপোর্ট করলাম

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  // ১. চেক করা ইউজার ডাটাবেজে আছে কি না
  const userData = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (userData.rows.length === 0) {
    throw new Error("Invalid credentials");
  }
  const user = userData.rows[0];

  // ২. পাসওয়ার্ড কম্পেয়ার করা
  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Invalid credentials");
  }

  // ৩. পেলোড তৈরি
  const jwtPayload: TJwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    is_active: user.is_active,
    email: user.email,
  };

  // ৪. টোকেন জেনারেট করা (ইউটিলিটি ফাংশন ব্যবহার করে)
  const { accessToken, refreshToken } = generateTokens(jwtPayload);

  return { accessToken, refreshToken };
};

const generateFreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized access!!");
  }

  // টোকেন ভেরিফাই করা
  const decoded = jwt.verify(
    token,
    config.refresh_secret as string,
  ) as JwtPayload;

  // 🛠️ ফিক্সড: টেবিলের নাম 'users' যোগ করা হয়েছে
  const userData = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    decoded.email,
  ]);

  if (userData.rows.length === 0) {
    throw new Error("User not found !!!");
  }

  const user = userData.rows[0];

  // 🛠️ ফিক্সড: 'if_active' পরিবর্তন করে 'is_active' করা হয়েছে
  if (!user?.is_active) {
    throw new Error("Forbidden !!!");
  }

  const jwtPayload: TJwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    is_active: user.is_active,
    email: user.email,
  };

  // নতুন এক্সেস ও রিফ্রেশ টোকেন জেনারেট করা
  const tokens = generateTokens(jwtPayload);

  // আপনি চাইলে শুধু এক্সেস টোকেন অথবা দুটোই রিটার্ন করতে পারেন
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

export const authService = {
  loginUserIntoDB,
  generateFreshToken,
};
