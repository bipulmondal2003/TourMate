import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";
import { ok, fail } from "@/lib/apiResponse";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    if (!email || !password) return fail("Email and password are required.");

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) return fail("Invalid email or password.", 401);
    if (user.isSuspended) return fail("This account has been suspended. Contact support.", 403);

    const valid = await verifyPassword(password, user.password);
    if (!valid) return fail("Invalid email or password.", 401);

    const token = signToken({ id: user._id.toString(), role: user.role, name: user.name, email: user.email });
    setAuthCookie(token);

    return ok({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    return fail(err.message || "Login failed.", 500);
  }
}
