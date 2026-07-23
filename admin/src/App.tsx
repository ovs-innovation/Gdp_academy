import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { RoleProvider } from "@/contexts/RoleContext";
import { ThemeColorProvider } from "@/contexts/ThemeColorContext";
import UsersPage from "./pages/UsersPage";
import MembersPage from "./pages/MembersPage";
import RolesPage from "./pages/RolesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SupportTicketsPage from "./pages/SupportTicketsPage";
import BlogsPage from "./pages/BlogsPage";
import ReviewModerationPage from "./pages/ReviewModerationPage";
import ProgramManagementPage from "./pages/ProgramManagementPage";
import DanceStyleManagementPage from "./pages/DanceStyleManagementPage";
import PaymentsPage from "./pages/PaymentsPage";
import CMSPage from "./pages/CMSPage";
import FAQManagementPage from "./pages/FAQManagementPage";
import MembershipPlansPage from "./pages/MembershipPlansPage";
import ContactMessagesPage from "./pages/ContactMessagesPage";
import WorkshopsManagementPage from "./pages/WorkshopsManagementPage";
import EnquiriesPage from "./pages/EnquiriesPage";
import GalleryPage from "./pages/GalleryPage";
import TestimonialsManagementPage from "./pages/TestimonialsManagementPage";
import ServicesCMSPage from "./pages/ServicesCMSPage";
import NotificationsPage from "./pages/NotificationsPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardRouter from "./components/DashboardRouter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <ThemeColorProvider>
        <RoleProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute permission="dashboard.view">
                      <DashboardRouter />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute permission="users.view">
                      <UsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/members"
                  element={
                    <ProtectedRoute permission="students.view">
                      <MembersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/roles"
                  element={
                    <ProtectedRoute permission="roles.view">
                      <RolesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute permission="analytics.view">
                      <AnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute permission="reports.view">
                      <ReportsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/support-tickets"
                  element={
                    <ProtectedRoute permission="reports.view">
                      <SupportTicketsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/blogs"
                  element={
                    <ProtectedRoute permission="blogs.view">
                      <BlogsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reviews"
                  element={
                    <ProtectedRoute permission="testimonials.view">
                      <ReviewModerationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/enquiries"
                  element={
                    <ProtectedRoute permission="enquiries.view">
                      <EnquiriesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payments"
                  element={
                    <ProtectedRoute permission="payments.view">
                      <PaymentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute permission="settings.view">
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cms"
                  element={
                    <ProtectedRoute anyOf={["cms.view", "pages.view", "settings.view"]}>
                      <CMSPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/faqs"
                  element={
                    <ProtectedRoute permission="faqs.view">
                      <FAQManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/membership-plans"
                  element={
                    <ProtectedRoute permission="membershipPlans.view">
                      <MembershipPlansPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contact-messages"
                  element={
                    <ProtectedRoute permission="contactMessages.view">
                      <ContactMessagesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/gallery"
                  element={
                    <ProtectedRoute permission="gallery.view">
                      <GalleryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/testimonials"
                  element={
                    <ProtectedRoute permission="testimonials.view">
                      <TestimonialsManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/services-cms"
                  element={
                    <ProtectedRoute anyOf={["cms.view", "pages.edit", "settings.edit"]}>
                      <ServicesCMSPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute permission="notifications.view">
                      <NotificationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/workshops"
                  element={
                    <ProtectedRoute permission="workshops.view">
                      <WorkshopsManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/programs"
                  element={
                    <ProtectedRoute permission="programs.view">
                      <ProgramManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dance-styles"
                  element={
                    <ProtectedRoute permission="categories.view">
                      <DanceStyleManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </RoleProvider>
      </ThemeColorProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
