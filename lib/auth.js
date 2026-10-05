import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const AUTH_SECRET = process.env.AUTH_SECRET || "dev-only-insecure-secret-change-me";
const COOKIE_NAME = "tourmate_token";
const TOKEN_EXPIRY = "7d";

export async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

export function signToken(payload) {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, AUTH_SECRET);
  } catch {
    return null;
  }
}

export function setAuthCookie(token) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie() {
  cookies().delete(COOKIE_NAME);
}

/**
 * Reads the JWT from the cookie store and returns the decoded payload
 * ({ id, role, email }) or null if unauthenticated.
 * Use inside Route Handlers / Server Components.
 */
export function getCurrentUserFromCookies() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME;
