import { useEffect, useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import PopularDestinations from "@/components/home/PopularDestinations";
import FeaturedGuides from "@/components/home/FeaturedGuides";
import HowItWorks from "@/components/home/HowItWorks";
import PopularExperiences from "@/components/home/PopularExperiences";
import Testimonials from "@/components/home/Testimonials";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CTASection from "@/components/home/CTASection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// In the Next.js version this page was a Server Component that queried MongoDB directly.
// In React there is no server, so the same data now comes from the Next.js JSON API.
export default function Home() {
  const [data, setData] = useState({ destinations: [], guides: [], loading: true, loadFailed: false });

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/destinations").then((r) => r.json()),
      fetch("/api/guides?limit=8&sort=rating").then((r) => r.json()),
    ])
      .then(([d, g]) => {
        if (cancelled) return;
        if (!d.success || !g.success) throw new Error("API returned an error");
        setData({ destinations: d.destinations, guides: g.guides, loading: false, loadFailed: false });
      })
      .catch((err) => {
        console.error("[home] Failed to load homepage data:", err);
        if (!cancelled) setData({ destinations: [], guides: [], loading: false, loadFailed: true });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <HeroSection />
      {data.loading ? (
        <div className="container-page py-20">
          <LoadingSpinner full />
        </div>
      ) : (
        <>
          <PopularDestinations destinations={data.destinations} />
          <FeaturedGuides guides={data.guides} loadFailed={data.loadFailed} />
        </>
      )}
      <HowItWorks />
      <PopularExperiences />
      <Testimonials />
      <WhyChooseUs />
      <CTASection />
    </>
  );
}
