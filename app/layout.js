import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/shared/Footer";
import GlassEffects from "@/components/effects/GlassEffects";
import CustomCursor from "@/components/effects/CustomCursor";

export const metadata = {
  title: "TourMate | Explore the World With Someone Who Knows It Best.",
  description:
    "TourMate connects tourists with verified local tour guides. Discover, book, and explore with confidence.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- this IS the root layout (App Router's _document.js equivalent), so this rule's premise doesn't apply */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <AuthProvider>
            <GlassEffects />
            <CustomCursor />
            <div className="relative z-10 min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
