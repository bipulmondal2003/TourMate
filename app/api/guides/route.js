import { connectDB } from "@/lib/db";
import Guide from "@/models/Guide";
import { ok, serverError } from "@/lib/apiResponse";
import { escapeRegex } from "@/utils/validators";

// Always run at request time: this endpoint depends on the query string
// (search / filters / pagination) and on live database content.
export const dynamic = "force-dynamic";

// Parses a numeric query param; returns undefined when missing or not a finite number.
function numberParam(value) {
  if (value === null || value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = (searchParams.get("search") || "").trim();
    const language = searchParams.get("language") || "";
    const category = (searchParams.get("category") || "").trim();
    const minPrice = numberParam(searchParams.get("minPrice"));
    const maxPrice = numberParam(searchParams.get("maxPrice"));
    const rating = numberParam(searchParams.get("rating"));
    const sort = searchParams.get("sort") || "rating";

    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "12", 10);
    const page = Number.isFinite(pageParam) ? Math.max(1, pageParam) : 1;
    const limit = Number.isFinite(limitParam) ? Math.min(24, Math.max(1, limitParam)) : 12;

    const query = { status: "approved" };

    // User input is escaped so characters like "(" or "+" can't produce an invalid regex (HTTP 500).
    if (search) {
      const safe = escapeRegex(search);
      query.$or = [
        { location: { $regex: safe, $options: "i" } },
        { specialties: { $regex: safe, $options: "i" } },
      ];
    }

    if (language) query.languages = language;

    if (category) {
      query.specialties = { $regex: escapeRegex(category), $options: "i" };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.pricePerDay = {};
      if (minPrice !== undefined) query.pricePerDay.$gte = minPrice;
      if (maxPrice !== undefined) query.pricePerDay.$lte = maxPrice;
    }

    if (rating !== undefined) {
      query.rating = { $gte: rating };
    }

    const sortMap = {
      rating: { rating: -1 },
      price_asc: { pricePerDay: 1 },
      price_desc: { pricePerDay: -1 },
      experience: { experience: -1 },
    };

    const total = await Guide.countDocuments(query);

    const guides = await Guide.find(query)
      .populate("user", "name email avatar")
      .sort(sortMap[sort] || sortMap.rating)
      .skip((page - 1) * limit)
      .limit(limit);

    return ok({
      guides,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return serverError(err, "Failed to load guides.", "GET /api/guides");
  }
}
