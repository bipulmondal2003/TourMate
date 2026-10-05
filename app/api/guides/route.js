import { connectDB } from "@/lib/db";
import Guide from "@/models/Guide";
import User from "@/models/User";
import { ok, fail } from "@/lib/apiResponse";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const language = searchParams.get("language") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const rating = searchParams.get("rating");
    const sort = searchParams.get("sort") || "rating";

    const page = Math.max(
      1,
      parseInt(searchParams.get("page") || "1", 10)
    );

    const limit = Math.min(
      24,
      parseInt(searchParams.get("limit") || "12", 10)
    );

    const query = { status: "approved" };

    if (search) {
      query.$or = [
        { location: { $regex: search, $options: "i" } },
        { specialties: { $regex: search, $options: "i" } },
      ];
    }

    if (language) query.languages = language;

    if (category) {
      query.specialties = {
        $regex: category,
        $options: "i",
      };
    }

    if (minPrice || maxPrice) {
      query.pricePerDay = {};

      if (minPrice) {
        query.pricePerDay.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.pricePerDay.$lte = Number(maxPrice);
      }
    }

    if (rating) {
      query.rating = {
        $gte: Number(rating),
      };
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
    console.error("GET /api/guides error:", err);

    return fail(
      err.message || "Failed to load guides.",
      500
    );
  }
}

// import { connectDB } from "@/lib/db";
// import Guide from "@/models/Guide";
// import { ok, fail } from "@/lib/apiResponse";

// export async function GET(req) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(req.url);

//     const search = searchParams.get("search") || "";
//     const language = searchParams.get("language") || "";
//     const category = searchParams.get("category") || "";
//     const minPrice = searchParams.get("minPrice");
//     const maxPrice = searchParams.get("maxPrice");
//     const rating = searchParams.get("rating");
//     const sort = searchParams.get("sort") || "rating";
//     const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
//     const limit = Math.min(24, parseInt(searchParams.get("limit") || "12", 10));

//     const query = { status: "approved" };

//     if (search) {
//       query.$or = [
//         { location: { $regex: search, $options: "i" } },
//         { specialties: { $regex: search, $options: "i" } },
//       ];
//     }
//     if (language) query.languages = language;
//     if (category) query.specialties = { $regex: category, $options: "i" };
//     if (minPrice || maxPrice) {
//       query.pricePerDay = {};
//       if (minPrice) query.pricePerDay.$gte = Number(minPrice);
//       if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
//     }
//     if (rating) query.rating = { $gte: Number(rating) };

//     const sortMap = {
//       rating: { rating: -1 },
//       price_asc: { pricePerDay: 1 },
//       price_desc: { pricePerDay: -1 },
//       experience: { experience: -1 },
//     };

//     const total = await Guide.countDocuments(query);
//     const guides = await Guide.find(query)
//       .populate("user", "name email avatar")
//       .sort(sortMap[sort] || sortMap.rating)
//       .skip((page - 1) * limit)
//       .limit(limit);

//     return ok({
//       guides,
//       pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
//     });
//   } catch (err) {
//     return fail(err.message || "Failed to load guides.", 500);
//   }
// }
