import { connectDB } from "@/lib/db";
import Guide from "@/models/Guide";
import Destination from "@/models/Destination";
import HeroSection from "@/components/home/HeroSection";
import PopularDestinations from "@/components/home/PopularDestinations";
import FeaturedGuides from "@/components/home/FeaturedGuides";
import HowItWorks from "@/components/home/HowItWorks";
import PopularExperiences from "@/components/home/PopularExperiences";
import Testimonials from "@/components/home/Testimonials";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CTASection from "@/components/home/CTASection";

export const dynamic = "force-dynamic";


// Server Component: fetches directly via Mongoose for fast first paint.
// (Client-side pages like /guides use the fetch-based API instead.)
async function getHomeData() {
  try {
    await connectDB();
    const [destinations, guides] = await Promise.all([
      Destination.find().sort({ isFeatured: -1 }).limit(8).lean(),
      Guide.find({ status: "approved" }).sort({ rating: -1 }).limit(8).populate("user", "name avatar").lean(),
    ]);
    return {
      destinations: JSON.parse(JSON.stringify(destinations)),
      guides: JSON.parse(JSON.stringify(guides)),
      loadFailed: false,
    };
  } catch (error) {
    // Never swallow this silently: it is the difference between "no guides exist" and
    // "the database/config is broken". Visible in Vercel > Project > Logs.
    console.error("[home] Failed to load homepage data:", error);
    return { destinations: [], guides: [], loadFailed: true };
  }
}

export default async function HomePage() {
  const { destinations, guides, loadFailed } = await getHomeData();

  return (
    <>
      <HeroSection />
      <PopularDestinations destinations={destinations} />
      <FeaturedGuides guides={guides} loadFailed={loadFailed} />
      <HowItWorks />
      <PopularExperiences />
      <Testimonials />
      <WhyChooseUs />
      <CTASection />
    </>
  );
}
