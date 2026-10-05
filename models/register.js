/**
 * Central model registry.
 *
 * On a long-running dev server every route shares one module graph, so a
 * model imported by *any* route is registered for *all* routes. On Vercel each
 * route is bundled into its own serverless function that only loads the models
 * it imports directly, so `.populate("user")` in a route that never imported
 * `User` throws:
 *
 *   MissingSchemaError: Schema hasn't been registered for model "User"
 *
 * Importing this file (done once, from lib/db.js) guarantees that EVERY model
 * is registered before any query or populate runs, in every environment.
 *
 * Each model file already guards against double compilation with
 * `mongoose.models.X || mongoose.model("X", schema)`.
 */
import User from "@/models/User";
import Guide from "@/models/Guide";
import Booking from "@/models/Booking";
import Availability from "@/models/Availability";
import Review from "@/models/Review";
import Payment from "@/models/Payment";
import Favorite from "@/models/Favorite";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import Notification from "@/models/Notification";
import Destination from "@/models/Destination";
import TourCategory from "@/models/TourCategory";
import Report from "@/models/Report";

/**
 * Returns every registered model. Referencing the models in a function (rather
 * than relying on bare side-effect imports) stops bundlers from ever dropping
 * them as "unused".
 */
export function registerModels() {
  return {
    User,
    Guide,
    Booking,
    Availability,
    Review,
    Payment,
    Favorite,
    Conversation,
    Message,
    Notification,
    Destination,
    TourCategory,
    Report,
  };
}

export default registerModels;
