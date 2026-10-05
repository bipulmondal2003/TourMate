import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Guide from "@/models/Guide";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";
import { ok, fail, serverError } from "@/lib/apiResponse";
import { isValidEmail } from "@/utils/validators";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password, role = "TOURIST", location, pricePerDay, pricePerHour } = body;

    if (!name || !email || !password) return fail("Name, email and password are required.");
    if (!isValidEmail(email)) return fail("Please enter a valid email address.");
    if (password.length < 6) return fail("Password must be at least 6 characters.");
    if (!["TOURIST", "GUIDE"].includes(role)) return fail("Invalid role.");

    // Validate guide-only fields BEFORE creating the user, so a failed guide signup
    // doesn't leave an orphaned account that blocks the email from being reused.
    if (role === "GUIDE" && (!location || !pricePerDay || !pricePerHour)) {
      return fail("Location, price per day and price per hour are required for guide registration.");
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return fail("An account with this email already exists.", 409);

    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed, role });

    if (role === "GUIDE") {
      try {
        await Guide.create({
          user: user._id,
          location,
          pricePerDay,
          pricePerHour,
          status: "pending",
        });
      } catch (guideErr) {
        // Don't leave a half-registered account behind (it would block the email from being reused).
        await User.deleteOne({ _id: user._id });
        throw guideErr;
      }
    }

    const token = signToken({ id: user._id.toString(), role: user.role, name: user.name, email: user.email });
    setAuthCookie(token);

    return ok(
      {
        user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
        message:
          role === "GUIDE"
            ? "Registered! Your guide profile is pending admin approval."
            : "Registered successfully.",
      },
      201
    );
  } catch (err) {
    return serverError(err, "Registration failed.");
  }
}
