import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/shared/Footer";
import GlassEffects from "@/components/effects/GlassEffects";
import CustomCursor from "@/components/effects/CustomCursor";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import ScrollToTop from "@/components/shared/ScrollToTop";

/** Site-wide frame (equivalent of app/layout.js in the Next.js version). */
export default function MainLayout() {
  return (
    <>
      <ScrollToTop />
      <GlassEffects />
      <CustomCursor />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </>
  );
}
