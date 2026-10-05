import mongoose from "mongoose";
import { registerModels } from "@/models/register";

/**
 * Cached MongoDB connection, safe for both `next dev` (hot reloads) and
 * Vercel serverless functions (warm invocations reuse the same container).
 *
 * - The URI is read lazily inside connectDB(), so `next build` never fails just
 *   because the variable is absent while pages are being analysed.
 * - There is intentionally NO fallback to a local MongoDB. A missing variable
 *   in production must fail loudly instead of quietly querying an empty
 *   database (which looks like "No guides yet").
 * - All Mongoose models are registered here so `.populate()` always works.
 */
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null, warned: false };
}

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri || !uri.trim()) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local for local development, " +
        "or to Vercel > Project > Settings > Environment Variables for production."
    );
  }
  return uri.trim();
}

// Warn (without ever printing the URI or credentials) when the connection string
// has no database name: MongoDB would silently use the default "test" database.
function warnIfNoDatabaseName(uri) {
  if (cached.warned) return;
  cached.warned = true;
  try {
    const withoutScheme = uri.replace(/^mongodb(\+srv)?:\/\//, "");
    const afterHost = withoutScheme.includes("/") ? withoutScheme.slice(withoutScheme.indexOf("/") + 1) : "";
    const dbName = afterHost.split("?")[0];
    if (!dbName) {
      console.warn(
        "[db] MONGODB_URI has no database name (e.g. ...mongodb.net/tourmate?...). " +
          'MongoDB will use the default "test" database, which is probably not where your data lives.'
      );
    }
  } catch {
    /* purely advisory */
  }
}

export async function connectDB() {
  // Register every model before any query/populate can run.
  registerModels();

  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;

  if (!cached.promise) {
    const uri = getMongoUri();
    warnIfNoDatabaseName(uri);

    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        // Serverless-friendly: small pool per container, fail fast instead of hanging until the function times out.
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 8000,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset so the next request retries instead of reusing a rejected promise forever.
    cached.promise = null;
    cached.conn = null;
    console.error("[db] MongoDB connection failed:", err?.name, err?.message);
    throw err;
  }

  return cached.conn;
}
