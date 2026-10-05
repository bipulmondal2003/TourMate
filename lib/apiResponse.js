import { NextResponse } from "next/server";

export function ok(data, status = 200) {
  return NextResponse.json({ success: true, ...data }, { status });
}

export function fail(message, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

/**
 * Turns an unexpected exception into a safe JSON response.
 *
 * - ALWAYS logs the full error server-side (visible in Vercel > Logs) so real
 *   production problems are never hidden.
 * - Never leaks internals (stack traces, hostnames, schema errors) to the
 *   browser in production; development still shows the real message.
 * - Known "client mistake" errors keep a helpful message and a 4xx status.
 */
export function serverError(err, fallbackMessage = "Something went wrong. Please try again.", context = "") {
  console.error(`[api] ${context || fallbackMessage}`, err);

  // Errors that deliberately carry an HTTP status (e.g. input validation helpers).
  if (err && typeof err.status === "number" && err.status >= 400 && err.status < 500) {
    return fail(err.message || fallbackMessage, err.status);
  }
  if (err instanceof SyntaxError && /JSON/i.test(err.message || "")) return fail("Invalid request body.", 400);
  if (err?.name === "ValidationError") return fail(err.message || "Validation failed.", 400);
  if (err?.name === "CastError") return fail("Invalid id or value supplied.", 400);
  if (err?.code === 11000) return fail("A record with that value already exists.", 409);

  const message =
    process.env.NODE_ENV === "production" ? fallbackMessage : `${fallbackMessage} (${err?.message || "unknown error"})`;
  return fail(message, 500);
}

/**
 * Wraps a route handler so any thrown error becomes a logged, safe JSON 500
 * instead of an HTML error page the client cannot parse.
 */
export function withErrorHandling(handler, context = "API request failed") {
  return async function wrapped(...args) {
    try {
      return await handler(...args);
    } catch (err) {
      return serverError(err, "Something went wrong. Please try again.", context);
    }
  };
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
