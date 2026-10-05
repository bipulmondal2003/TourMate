import { NextResponse } from "next/server";

export function ok(data, status = 200) {
  return NextResponse.json({ success: true, ...data }, { status });
}

export function fail(message, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export function requireAuth(user) {
  if (!user) {
    return fail("Authentication required.", 401);
  }
  return null;
}

export function requireRole(user, roles) {
  if (!user) return fail("Authentication required.", 401);
  if (!roles.includes(user.role)) {
    return fail("You do not have permission to perform this action.", 403);
  }
  return null;
}
