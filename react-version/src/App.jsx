import { Routes, Route } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import TouristLayout from "@/layouts/TouristLayout";
import GuideLayout from "@/layouts/GuideLayout";
import AdminLayout from "@/layouts/AdminLayout";

// public pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Faq from "@/pages/Faq";
import HowItWorksPage from "@/pages/HowItWorksPage";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Guides from "@/pages/Guides";
import GuideDetail from "@/pages/GuideDetail";
import Destinations from "@/pages/Destinations";
import DestinationDetail from "@/pages/DestinationDetail";
import Booking from "@/pages/Booking";
import TripPlanner from "@/pages/TripPlanner";
import NotFound from "@/pages/NotFound";

// tourist dashboard
import TouristOverview from "@/pages/dashboard/Overview";
import TouristBookings from "@/pages/dashboard/Bookings";
import TouristBookingDetail from "@/pages/dashboard/BookingDetail";
import TouristFavorites from "@/pages/dashboard/Favorites";
import TouristMessages from "@/pages/dashboard/Messages";
import TouristNotifications from "@/pages/dashboard/Notifications";
import TouristProfile from "@/pages/dashboard/Profile";
import TouristSettings from "@/pages/dashboard/Settings";

// guide dashboard
import GuideOverview from "@/pages/guide/Overview";
import GuideBookings from "@/pages/guide/Bookings";
import GuideBookingDetail from "@/pages/guide/BookingDetail";
import GuideAvailability from "@/pages/guide/Availability";
import GuideEarnings from "@/pages/guide/Earnings";
import GuideReviews from "@/pages/guide/Reviews";
import GuideMessages from "@/pages/guide/Messages";
import GuideNotifications from "@/pages/guide/Notifications";
import GuideProfile from "@/pages/guide/Profile";
import GuideSettings from "@/pages/guide/Settings";

// admin panel
import AdminOverview from "@/pages/admin/Overview";
import AdminUsers from "@/pages/admin/Users";
import AdminGuides from "@/pages/admin/Guides";
import AdminBookings from "@/pages/admin/Bookings";
import AdminReviews from "@/pages/admin/Reviews";
import AdminDestinations from "@/pages/admin/Destinations";
import AdminCategories from "@/pages/admin/Categories";
import AdminPayments from "@/pages/admin/Payments";
import AdminReports from "@/pages/admin/Reports";
import AdminSettings from "@/pages/admin/Settings";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<Faq />} />
        <Route path="how-it-works" element={<HowItWorksPage />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="guides" element={<Guides />} />
        <Route path="guides/:id" element={<GuideDetail />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="destinations/:id" element={<DestinationDetail />} />
        <Route path="booking/:guideId" element={<Booking />} />
        <Route path="trip-planner" element={<TripPlanner />} />

        {/* Tourist dashboard (TOURIST role) */}
        <Route path="dashboard" element={<TouristLayout />}>
          <Route index element={<TouristOverview />} />
          <Route path="bookings" element={<TouristBookings />} />
          <Route path="bookings/:id" element={<TouristBookingDetail />} />
          <Route path="favorites" element={<TouristFavorites />} />
          <Route path="messages" element={<TouristMessages />} />
          <Route path="notifications" element={<TouristNotifications />} />
          <Route path="profile" element={<TouristProfile />} />
          <Route path="settings" element={<TouristSettings />} />
        </Route>

        {/* Guide dashboard (GUIDE role) */}
        <Route path="guide-dashboard" element={<GuideLayout />}>
          <Route index element={<GuideOverview />} />
          <Route path="bookings" element={<GuideBookings />} />
          <Route path="bookings/:id" element={<GuideBookingDetail />} />
          <Route path="availability" element={<GuideAvailability />} />
          <Route path="earnings" element={<GuideEarnings />} />
          <Route path="reviews" element={<GuideReviews />} />
          <Route path="messages" element={<GuideMessages />} />
          <Route path="notifications" element={<GuideNotifications />} />
          <Route path="profile" element={<GuideProfile />} />
          <Route path="settings" element={<GuideSettings />} />
        </Route>

        {/* Admin panel (ADMIN role) */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="guides" element={<AdminGuides />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="destinations" element={<AdminDestinations />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
