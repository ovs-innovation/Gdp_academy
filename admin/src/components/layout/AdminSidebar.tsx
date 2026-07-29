import { NavLink } from "@/components/NavLink";
import { useRole } from "@/contexts/RoleContext";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Permission } from "@/lib/rbac";
import {
  LayoutDashboard,
  Users,
  Shield,
  Settings,
  BarChart3,
  FileText,
  ChevronLeft,
  Menu,
  MessageSquare,
  Bell,
  UserCircle,
  BookOpen,
  FolderTree,
  ChevronDown,
  ChevronRight,
  Calendar,
  DollarSign,
  Image,
  HelpCircle,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type NavItem = {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  permission?: Permission;
  anyOf?: Permission[];
};

const adminNavItems: NavItem[] = [
  {
    to: "/",
    icon: LayoutDashboard,
    label: "Dashboard",
    permission: "dashboard.view",
  },
  {
    to: "/users",
    icon: Users,
    label: "Users",
    permission: "users.view",
  },
  {
    to: "/members",
    icon: UserCircle,
    label: "Students",
    permission: "students.view",
  },
  {
    to: "/enquiries",
    icon: MessageSquare,
    label: "Enquiries",
    permission: "enquiries.view",
  },
  {
    to: "/roles",
    icon: Shield,
    label: "Permissions",
    permission: "roles.view",
  },
  {
    to: "/payments",
    icon: DollarSign,
    label: "Payments",
    permission: "payments.view",
  },
  {
    to: "/analytics",
    icon: BarChart3,
    label: "Analytics",
    permission: "analytics.view",
  },
  {
    to: "/reports",
    icon: FileText,
    label: "Reports",
    permission: "reports.view",
  },
  {
    to: "/support-tickets",
    icon: MessageSquare,
    label: "Support",
    permission: "reports.view",
  },
  {
    to: "/contact-messages",
    icon: MessageSquare,
    label: "Contact Messages",
    permission: "contactMessages.view",
  },
  {
    to: "/notifications",
    icon: Bell,
    label: "Notifications",
    permission: "notifications.view",
  },
  {
    to: "/settings",
    icon: Settings,
    label: "Settings",
    permission: "settings.view",
  },
];

const WebsiteManagementItems: NavItem[] = [
  {
    to: "/cms",
    icon: FileText,
    label: "1. Website Control (Hero/Info)",
    anyOf: ["cms.view", "pages.view", "settings.view"],
  },
  {
    to: "/services-cms",
    icon: FolderTree,
    label: "2. Service Cards",
    anyOf: ["cms.view", "pages.edit", "settings.edit"],
  },
  {
    to: "/programs",
    icon: BookOpen,
    label: "3. Programs & Classes",
    permission: "programs.view",
  },
  {
    to: "/workshops",
    icon: Calendar,
    label: "4. Upcoming Workshops",
    permission: "workshops.view",
  },
  {
    to: "/blogs",
    icon: FileText,
    label: "5. Blog Posts",
    permission: "blogs.view",
  },
  {
    to: "/gallery",
    icon: Image,
    label: "6. Photos & Videos",
    permission: "gallery.view",
  },
  {
    to: "/testimonials",
    icon: MessageSquare,
    label: "7. Student Reviews",
    permission: "testimonials.view",
  },
  {
    to: "/faqs",
    icon: HelpCircle,
    label: "8. FAQ Questions",
    permission: "faqs.view",
  },
  {
    to: "/membership-plans",
    icon: DollarSign,
    label: "9. Membership Plans",
    permission: "membershipPlans.view",
  },
  {
    to: "/dance-styles",
    icon: FolderTree,
    label: "10. Dance Styles (Categories)",
    permission: "categories.view",
  },
];

const StudentOperationsItems: NavItem[] = [
  {
    to: "/members",
    icon: Users,
    label: "Students List",
    permission: "students.view",
  },
  {
    to: "/enquiries",
    icon: MessageSquare,
    label: "Enquiries (Form)",
    permission: "enquiries.view",
  },
  {
    to: "/contact-messages",
    icon: MessageSquare,
    label: "Contact Messages",
    permission: "contactMessages.view",
  },
  {
    to: "/support-tickets",
    icon: MessageSquare,
    label: "Support Tickets",
    permission: "reports.view",
  },
];

const SystemAdminItems: NavItem[] = [
  {
    to: "/payments",
    icon: DollarSign,
    label: "Payments",
    permission: "payments.view",
  },
  {
    to: "/analytics",
    icon: BarChart3,
    label: "Analytics",
    permission: "analytics.view",
  },
  {
    to: "/reports",
    icon: FileText,
    label: "Reports",
    permission: "reports.view",
  },
  {
    to: "/users",
    icon: Users,
    label: "Users List",
    permission: "users.view",
  },
  {
    to: "/roles",
    icon: Shield,
    label: "Role Permissions",
    permission: "roles.view",
  },
  {
    to: "/notifications",
    icon: Bell,
    label: "System Alerts",
    permission: "notifications.view",
  },
  {
    to: "/settings",
    icon: Settings,
    label: "Settings",
    permission: "settings.view",
  },
];

type AdminSidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export function AdminSidebar({ mobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { currentRole, can, canAny } = useRole();
  const isMobile = useIsMobile();

  const canSeeItem = (item: NavItem) => {
    if (item.anyOf?.length) return canAny(item.anyOf);
    if (item.permission) return can(item.permission);
    return true;
  };

  const showDashboard = can("dashboard.view");

  const websiteItems = useMemo(
    () => WebsiteManagementItems.filter(canSeeItem),
    [currentRole, can, canAny],
  );

  const studentItems = useMemo(
    () => StudentOperationsItems.filter(canSeeItem),
    [currentRole, can, canAny],
  );

  const adminItems = useMemo(
    () => SystemAdminItems.filter(canSeeItem),
    [currentRole, can, canAny],
  );

  const name = localStorage.getItem('user-name') || sessionStorage.getItem('user-name') || '';
  const email = localStorage.getItem('user-email') || sessionStorage.getItem('user-email') || '';
  const displayName = name || email || 'User';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2) || 'GD';

  useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobile, mobileOpen]);

  const handleNavClick = () => {
    if (isMobile) onMobileClose?.();
  };

  const renderNavLink = (item: NavItem, compact = false) => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.to === "/"}
      onClick={handleNavClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        compact ? "py-2" : "py-2.5",
        collapsed && !isMobile && "justify-center px-2",
      )}
      activeClassName="bg-sidebar-accent text-sidebar-primary shadow-glow"
    >
      <item.icon className={cn("flex-shrink-0", compact ? "h-4 w-4" : "h-5 w-5")} />
      {(!collapsed || isMobile) && <span>{item.label}</span>}
    </NavLink>
  );

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {(!collapsed || isMobile) ? (
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-semibold text-lg tracking-wider">
              GD
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-semibold tracking-tight text-foreground">
                GDP ACADEMY
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                Admin Control
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-semibold text-lg tracking-wider">
            GD
          </div>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {collapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto p-3 admin-mobile-sidebar">
        {showDashboard && (
          <div className="space-y-1">
            {renderNavLink({
              to: "/",
              icon: LayoutDashboard,
              label: "Dashboard Overview"
            })}
          </div>
        )}

        {websiteItems.length > 0 && (
          <div className="space-y-1">
            {(!collapsed || isMobile) && (
              <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                Website Content
              </p>
            )}
            {websiteItems.map((item) => renderNavLink(item, true))}
          </div>
        )}

        {studentItems.length > 0 && (
          <div className="space-y-1">
            {(!collapsed || isMobile) && (
              <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                Students & Enquiries
              </p>
            )}
            {studentItems.map((item) => renderNavLink(item, true))}
          </div>
        )}

        {adminItems.length > 0 && (
          <div className="space-y-1">
            {(!collapsed || isMobile) && (
              <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                Administration
              </p>
            )}
            {adminItems.map((item) => renderNavLink(item, true))}
          </div>
        )}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && !isMobile && "justify-center",
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
            {initials}
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">
                {displayName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {currentRole
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {mobileOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={onMobileClose}
            aria-label="Close navigation"
          />
        )}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col border-r border-sidebar-border bg-sidebar shadow-2xl transition-transform duration-300 md:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
          aria-hidden={!mobileOpen}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 md:flex",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {sidebarContent}
    </aside>
  );
}
