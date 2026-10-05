/**
 * Seed script — populates MongoDB with realistic fictional demo data
 * so the application can be fully demonstrated out of the box.
 *
 * Usage: npm run seed
 */
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tourmate";
const DEMO_PASSWORD = "Demo@1234";

// Inline lightweight schemas (mirrors /models) so this script has no
// dependency on Next.js path aliases and can run standalone with `node`.
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["TOURIST", "GUIDE", "ADMIN"] },
    avatar: String,
    phone: String,
    isSuspended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const GuideSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bio: String,
    location: String,
    coverImage: String,
    experience: Number,
    languages: [String],
    specialties: [String],
    pricePerDay: Number,
    pricePerHour: Number,
    status: String,
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const DestinationSchema = new mongoose.Schema(
  {
    name: String,
    state: String,
    description: String,
    image: String,
    guideCount: { type: Number, default: 0 },
    isFeatured: Boolean,
  },
  { timestamps: true }
);

const TourCategorySchema = new mongoose.Schema({ name: String, icon: String, description: String }, { timestamps: true });

const BookingSchema = new mongoose.Schema(
  {
    tourist: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    guide: { type: mongoose.Schema.Types.ObjectId, ref: "Guide" },
    date: Date,
    startTime: String,
    durationHours: Number,
    numberOfPeople: Number,
    category: String,
    totalPrice: Number,
    status: String,
    paymentStatus: String,
    notes: String,
  },
  { timestamps: true }
);

const ReviewSchema = new mongoose.Schema(
  {
    tourist: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    guide: { type: mongoose.Schema.Types.ObjectId, ref: "Guide" },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    rating: Number,
    text: String,
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const AvailabilitySchema = new mongoose.Schema(
  { guide: { type: mongoose.Schema.Types.ObjectId, ref: "Guide" }, date: Date, isAvailable: Boolean, slots: [String] },
  { timestamps: true }
);

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: String,
    title: String,
    message: String,
    isRead: { type: Boolean, default: false },
    link: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
const Guide = mongoose.model("Guide", GuideSchema);
const Destination = mongoose.model("Destination", DestinationSchema);
const TourCategory = mongoose.model("TourCategory", TourCategorySchema);
const Booking = mongoose.model("Booking", BookingSchema);
const Review = mongoose.model("Review", ReviewSchema);
const Availability = mongoose.model("Availability", AvailabilitySchema);
const Notification = mongoose.model("Notification", NotificationSchema);

const DESTINATIONS = [
  { name: "Amritsar", state: "Punjab", description: "Home to the Golden Temple and vibrant street food culture.", isFeatured: true },
  { name: "Delhi", state: "Delhi", description: "India's capital, blending Mughal history with modern city life.", isFeatured: true },
  { name: "Jaipur", state: "Rajasthan", description: "The Pink City, famous for forts, palaces and bazaars.", isFeatured: true },
  { name: "Agra", state: "Uttar Pradesh", description: "Home to the iconic Taj Mahal.", isFeatured: true },
  { name: "Goa", state: "Goa", description: "Beaches, Portuguese heritage and vibrant nightlife.", isFeatured: true },
  { name: "Manali", state: "Himachal Pradesh", description: "Mountain adventure and scenic valleys.", isFeatured: true },
  { name: "Mumbai", state: "Maharashtra", description: "India's financial capital with a buzzing food and film scene.", isFeatured: false },
  { name: "Kolkata", state: "West Bengal", description: "The City of Joy — colonial architecture and rich culture.", isFeatured: false },
];

const CATEGORIES = ["Heritage", "Adventure", "Food", "Wildlife", "Spiritual", "Nightlife"];

const GUIDE_SEED = [
  { name: "Arjun Mehta", location: "Amritsar, Punjab", experience: 6, languages: ["English", "Hindi", "Punjabi"], specialties: ["Heritage", "Food"], pricePerDay: 3500, pricePerHour: 500, bio: "Local historian specializing in Golden Temple heritage tours and Amritsari food trails." },
  { name: "Simran Kaur", location: "Amritsar, Punjab", experience: 4, languages: ["English", "Punjabi"], specialties: ["Spiritual", "Heritage"], pricePerDay: 3000, pricePerHour: 450, bio: "Passionate about sharing the spiritual history of Punjab's gurdwaras." },
  { name: "Rohan Kapoor", location: "Delhi", experience: 8, languages: ["English", "Hindi", "French"], specialties: ["Heritage", "Nightlife"], pricePerDay: 4200, pricePerHour: 600, bio: "Delhi-based guide with a decade of experience covering Mughal monuments." },
  { name: "Fatima Sheikh", location: "Delhi", experience: 5, languages: ["English", "Hindi"], specialties: ["Food", "Heritage"], pricePerDay: 3800, pricePerHour: 550, bio: "Old Delhi food-walk specialist, born and raised in Chandni Chowk." },
  { name: "Vikram Singh Rathore", location: "Jaipur, Rajasthan", experience: 10, languages: ["English", "Hindi"], specialties: ["Heritage", "Adventure"], pricePerDay: 4500, pricePerHour: 650, bio: "Former palace tour coordinator with deep knowledge of Rajputana history." },
  { name: "Anjali Choudhary", location: "Jaipur, Rajasthan", experience: 3, languages: ["English", "Hindi", "Spanish"], specialties: ["Heritage"], pricePerDay: 2800, pricePerHour: 400, bio: "Loves showing travelers the artisan bazaars of the Pink City." },
  { name: "Imran Qureshi", location: "Agra, Uttar Pradesh", experience: 12, languages: ["English", "Hindi", "German"], specialties: ["Heritage"], pricePerDay: 4000, pricePerHour: 580, bio: "Certified Taj Mahal guide with over a decade of storytelling experience." },
  { name: "Sofia D'Souza", location: "Goa", experience: 5, languages: ["English", "Hindi"], specialties: ["Nightlife", "Adventure"], pricePerDay: 3600, pricePerHour: 500, bio: "Goa native who knows every beach shack and hidden cove." },
  { name: "Tenzin Norbu", location: "Manali, Himachal Pradesh", experience: 7, languages: ["English", "Hindi"], specialties: ["Adventure", "Wildlife"], pricePerDay: 4300, pricePerHour: 620, bio: "Trekking and adventure sports guide across the Himalayan valleys." },
  { name: "Pooja Iyer", location: "Mumbai, Maharashtra", experience: 4, languages: ["English", "Hindi"], specialties: ["Food", "Nightlife"], pricePerDay: 3300, pricePerHour: 480, bio: "Mumbai food and film-city tour specialist." },
  { name: "Debashish Roy", location: "Kolkata, West Bengal", experience: 9, languages: ["English", "Hindi"], specialties: ["Heritage", "Food"], pricePerDay: 3100, pricePerHour: 440, bio: "Kolkata heritage walk expert covering colonial architecture and street food." },
  { name: "Neha Bhatt", location: "Manali, Himachal Pradesh", experience: 2, languages: ["English"], specialties: ["Adventure"], pricePerDay: 2500, pricePerHour: 350, bio: "New but enthusiastic guide for river rafting and short treks." },
];

async function run() {
  console.log("Connecting to MongoDB:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  console.log("Clearing existing collections...");
  await Promise.all([
    User.deleteMany({}),
    Guide.deleteMany({}),
    Destination.deleteMany({}),
    TourCategory.deleteMany({}),
    Booking.deleteMany({}),
    Review.deleteMany({}),
    Availability.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  console.log("Creating demo accounts...");
  const admin = await User.create({ name: "Admin User", email: "admin@example.com", password: hashedPassword, role: "ADMIN" });
  const demoGuideUser = await User.create({ name: "Arjun Mehta", email: "guide@example.com", password: hashedPassword, role: "GUIDE" });
  const demoTourist = await User.create({ name: "Rahul Sharma", email: "tourist@example.com", password: hashedPassword, role: "TOURIST" });

  console.log("Seeding destinations...");
  const destinations = await Destination.insertMany(DESTINATIONS);

  console.log("Seeding categories...");
  await TourCategory.insertMany(CATEGORIES.map((name) => ({ name })));

  console.log("Seeding guides...");
  const guides = [];
  for (let i = 0; i < GUIDE_SEED.length; i++) {
    const g = GUIDE_SEED[i];
    let userDoc;
    if (i === 0) {
      userDoc = demoGuideUser; // link the demo guide account to the first seeded guide
    } else {
      userDoc = await User.create({
        name: g.name,
        email: `guide${i + 1}@example.com`,
        password: hashedPassword,
        role: "GUIDE",
      });
    }
    const guide = await Guide.create({
      user: userDoc._id,
      bio: g.bio,
      location: g.location,
      experience: g.experience,
      languages: g.languages,
      specialties: g.specialties,
      pricePerDay: g.pricePerDay,
      pricePerHour: g.pricePerHour,
      status: i < 10 ? "approved" : "pending", // last 2 stay pending to demo the approval flow
      rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 20) + 1,
      totalBookings: Math.floor(Math.random() * 15),
      totalEarnings: Math.floor(Math.random() * 50000),
    });
    guides.push(guide);
  }

  console.log("Updating destination guide counts...");
  for (const dest of destinations) {
    const count = guides.filter((g) => g.location.includes(dest.name)).length;
    await Destination.findByIdAndUpdate(dest._id, { guideCount: count });
  }

  console.log("Seeding sample bookings & reviews...");
  const approvedGuides = guides.filter((g) => g.status === "approved");
  const today = new Date();

  for (let i = 0; i < 6; i++) {
    const guide = approvedGuides[i % approvedGuides.length];
    const isPast = i < 3;
    const date = new Date(today);
    date.setDate(today.getDate() + (isPast ? -(i + 2) : i + 3));

    const status = isPast ? "completed" : ["pending", "confirmed", "confirmed"][i % 3];
    const booking = await Booking.create({
      tourist: demoTourist._id,
      guide: guide._id,
      date,
      startTime: "10:00",
      durationHours: 4,
      numberOfPeople: 2,
      category: guide.specialties[0] || "General",
      totalPrice: guide.pricePerHour * 4,
      status,
      paymentStatus: isPast ? "paid" : "pending",
      notes: "Looking forward to the tour!",
    });

    if (isPast) {
      await Review.create({
        tourist: demoTourist._id,
        guide: guide._id,
        booking: booking._id,
        rating: 4 + (i % 2),
        text: "Fantastic experience! Our guide was knowledgeable and friendly throughout the trip.",
      });
    }
  }

  console.log("Seeding sample availability...");
  for (const guide of approvedGuides.slice(0, 5)) {
    for (let d = 1; d <= 5; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      await Availability.create({ guide: guide._id, date, isAvailable: true, slots: ["09:00", "13:00", "16:00"] });
    }
  }

  console.log("Seeding notifications...");
  await Notification.insertMany([
    {
      user: demoGuideUser._id,
      type: "new_booking",
      title: "New booking request",
      message: "You have a new booking request from Rahul Sharma.",
      link: "/guide-dashboard/bookings",
    },
    {
      user: demoTourist._id,
      type: "booking_accepted",
      title: "Booking confirmed!",
      message: "Your guide has accepted your booking request.",
      link: "/dashboard/bookings",
    },
  ]);

  console.log("\n✅ Seed complete!\n");
  console.log("Demo accounts (password for all: " + DEMO_PASSWORD + "):");
  console.log("  Admin:   admin@example.com");
  console.log("  Guide:   guide@example.com");
  console.log("  Tourist: tourist@example.com\n");

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
