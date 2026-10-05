import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const COOKIE_NAME = "tourmate_token";
const TOKEN_EXPIRY = "7d";
const DEV_FALLBACK_SECRET = "dev-only-insecure-secret-change-me";

let warnedAboutDevSecret = false;

/**
 * Read lazily (not at import time) so `next build` doesn't need the variable.
 * In production a missing AUTH_SECRET is a hard error: silently falling back to
 * a secret that is published in the repository would let anyone forge a login
 * token (including an ADMIN one).
 */
function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.trim()) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "AUTH_SECRET is not set. Add a long random value in Vercel > Project > Settings > Environment Variables."
    );
  }
  if (!warnedAboutDevSecret) {
    warnedAboutDevSecret = true;
    console.warn("[auth] AUTH_SECRET is not set; using an insecure development-only secret.");
  }
  return DEV_FALLBACK_SECRET;
}

export async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

export function signToken(payload) {
  return jwt.sign(payload, getAuthSecret(), { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token) {
  // Resolve the secret OUTSIDE the try/catch so a missing AUTH_SECRET surfaces as a
  // real server error instead of being mistaken for "this user is logged out".
  const secret = getAuthSecret();
  try {
    return jwt.verify(token, secret);
  } catch {
    // Expired / tampered / malformed token => treat as unauthenticated.
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
