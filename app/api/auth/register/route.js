import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Guide from "@/models/Guide";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";
import { ok, fail } from "@/lib/apiResponse";
import { isValidEmail } from "@/utils/validators";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password, role = "TOURIST", location, pricePerDay, pricePerHour } = body;

    if (!name || !email || !password) return fail("Name, email and password are required.");
    if (!isValidEmail(email)) return fail("Please enter a valid email address.");
    if (password.length < 6) return fail("Password must be at least 6 characters.");
    if (!["TOURIST", "GUIDE"].includes(role)) return fail("Invalid role.");

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return fail("An account with this email already exists.", 409);

    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed, role });

    if (role === "GUIDE") {
      if (!location || !pricePerDay || !pricePerHour) {
        return fail("Location, price per day and price per hour are required for guide registration.");
      }
      await Guide.create({
        user: user._id,
        location,
        pricePerDay,
        pricePerHour,
        status: "pending",
      });
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
    return fail(err.message || "Registration failed.", 500);
  }
}
