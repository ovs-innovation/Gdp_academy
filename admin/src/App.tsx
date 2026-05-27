import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { RoleProvider } from "@/contexts/RoleContext";
import { ThemeColorProvider } from "@/contexts/ThemeColorContext";
import ControlDashboardPage from "./pages/ControlDashboardPage";
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
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
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
                    <ProtectedRoute>
                      <DashboardRouter />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute>
                      <UsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/members"
                  element={
                    <ProtectedRoute>
                      <MembersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/roles"
                  element={
                    <ProtectedRoute>
                      <RolesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <AnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <ReportsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/support-tickets"
                  element={
                    <ProtectedRoute>
                      <SupportTicketsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/blogs"
                  element={
                    <ProtectedRoute>
                      <BlogsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reviews"
                  element={
                    <ProtectedRoute>
                      <ReviewModerationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/enquiries"
                  element={
                    <ProtectedRoute>
                      <EnquiriesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payments"
                  element={
                    <ProtectedRoute>
                      <PaymentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cms"
                  element={
                    <ProtectedRoute>
                      <CMSPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/faqs"
                  element={
                    <ProtectedRoute>
                      <FAQManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/membership-plans"
                  element={
                    <ProtectedRoute>
                      <MembershipPlansPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contact-messages"
                  element={
                    <ProtectedRoute>
                      <ContactMessagesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/gallery"
                  element={
                    <ProtectedRoute>
                      <GalleryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/testimonials"
                  element={
                    <ProtectedRoute>
                      <TestimonialsManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/services-cms"
                  element={
                    <ProtectedRoute>
                      <ServicesCMSPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/workshops"
                  element={
                    <ProtectedRoute>
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
                    <ProtectedRoute>
                      <ProgramManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dance-styles"
                  element={
                    <ProtectedRoute>
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
