import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { RoleProvider } from "@/contexts/RoleContext";
import { ThemeColorProvider } from "@/contexts/ThemeColorContext";
import ControlDashboardPage from "./pages/ControlDashboardPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import UsersPage from "./pages/UsersPage";
import TeachersPage from "./pages/TeachersPage";
import MembersPage from "./pages/MembersPage";
import RolesPage from "./pages/RolesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import TeacherProfilePage from "./pages/TeacherProfilePage";
import LoginPage from "./pages/LoginPage";
import SupportTicketsPage from "./pages/SupportTicketsPage";
import BlogsPage from "./pages/BlogsPage";
import ReviewModerationPage from "./pages/ReviewModerationPage";
import ProgramManagementPage from "./pages/ProgramManagementPage";
import DanceStyleManagementPage from "./pages/DanceStyleManagementPage";
import TeacherApprovalPage from "./pages/TeacherApprovalPage";
import TeacherJoinProgramPage from "./pages/TeacherJoinProgramPage";
import TeacherMyProgramsPage from "./pages/TeacherMyProgramsPage";
import TeacherAvailabilityPage from "./pages/TeacherAvailabilityPage";
import TeacherBookingsPage from "./pages/TeacherBookingsPage";
import PaymentsPage from "./pages/PaymentsPage";
import CMSPage from "./pages/CMSPage";
import WorkshopsManagementPage from "./pages/WorkshopsManagementPage";
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
                  path="/teacher-dashboard"
                  element={
                    <ProtectedRoute>
                      <TeacherDashboardPage />
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
                  path="/teachers"
                  element={
                    <ProtectedRoute>
                      <TeachersPage />
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
                  path="/teacher-profile"
                  element={
                    <ProtectedRoute>
                      <TeacherProfilePage />
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
                <Route
                  path="/teacher-approvals"
                  element={
                    <ProtectedRoute>
                      <TeacherApprovalPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/join-program"
                  element={
                    <ProtectedRoute>
                      <TeacherJoinProgramPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/my-programs"
                  element={
                    <ProtectedRoute>
                      <TeacherMyProgramsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/availability"
                  element={
                    <ProtectedRoute>
                      <TeacherAvailabilityPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/bookings"
                  element={
                    <ProtectedRoute>
                      <TeacherBookingsPage />
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
