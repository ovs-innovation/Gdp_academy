import { NavLink } from "@/components/NavLink";
import { useRole } from "@/contexts/RoleContext";
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
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const adminNavItems = [
  {
    to: "/",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    to: "/users",
    icon: Users,
    label: "Users",
  },
  {
    to: "/members",
    icon: UserCircle,
    label: "Students",
  },
  {
    to: "/enquiries",
    icon: MessageSquare,
    label: "Enquiries",
  },
  {
    to: "/roles",
    icon: Shield,
    label: "Permissions",
  },
  {
    to: "/payments",
    icon: DollarSign,
    label: "Payments",
  },
  {
    to: "/analytics",
    icon: BarChart3,
    label: "Analytics",
  },
  {
    to: "/reports",
    icon: FileText,
    label: "Reports",
  },
  {
    to: "/support-tickets",
    icon: MessageSquare,
    label: "Support",
  },
  {
    to: "/blogs",
    icon: Bell,
    label: "Blog",
  },
  {
    to: "/cms",
    icon: FileText,
    label: "Website Control",
  },
  {
    to: "/services-cms",
    icon: BookOpen,
    label: "Homepage Services",
  },
  {
    to: "/testimonials",
    icon: MessageSquare,
    label: "Student Reviews",
  },
  {
    to: "/gallery",
    icon: Image,
    label: "Photos & Videos",
  },
  {
    to: "/faqs",
    icon: HelpCircle,
    label: "FAQ Questions",
  },
  {
    to: "/membership-plans",
    icon: DollarSign,
    label: "Membership Plans",
  },
  {
    to: "/contact-messages",
    icon: MessageSquare,
    label: "Contact Messages",
  },
  {
    to: "/notifications",
    icon: Bell,
    label: "Notifications",
  },
  {
    to: "/settings",
    icon: Settings,
    label: "Settings",
  },
];

// Program Management sub-items
const ProgramManagementItems = [
  {
    to: "/programs",
    icon: BookOpen,
    label: "Programs",
  },
  {
    to: "/workshops",
    icon: Calendar,
    label: "Workshops",
  },
  {
    to: "/dance-styles",
    icon: FolderTree,
    label: "Dance Styles",
  },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const [ProgramManagementOpen, setProgramManagementOpen] = useState(true);

  const { currentRole } = useRole();

  const navItems = adminNavItems;

  const name = localStorage.getItem('user-name') || sessionStorage.getItem('user-name') || '';
  const email = localStorage.getItem('user-email') || sessionStorage.getItem('user-email') || '';
  const displayName = name || email || 'User';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2) || 'GD';

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span
              className="text-lg font-bold tracking-tighter"
              style={{ fontFamily: "Krona One" }}
            >
              GDP
              <span style={{ color: "#634BFA" }}>.</span>
            </span>
          </div>
        )}

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
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {/* Dashboard */}
        {navItems.slice(0, 1).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center px-2",
            )}
            activeClassName="bg-sidebar-accent text-sidebar-primary shadow-glow"
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />

            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        {/* Program Management */}
        {(currentRole === "admin" || currentRole === "super_admin") && (
          <Collapsible
            open={ProgramManagementOpen}
            onOpenChange={setProgramManagementOpen}
            className="space-y-1"
          >
            <CollapsibleTrigger
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2",
                ProgramManagementOpen && "bg-sidebar-accent/50",
              )}
            >
              <BookOpen className="h-5 w-5 flex-shrink-0" />

              {!collapsed && (
                <>
                  <span className="flex-1 text-left">Program Management</span>

                  {ProgramManagementOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </>
              )}
            </CollapsibleTrigger>

            {!collapsed && (
              <CollapsibleContent className="space-y-1 pl-4">
                {ProgramManagementItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                    activeClassName="bg-sidebar-accent text-sidebar-primary shadow-glow"
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />

                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </CollapsibleContent>
            )}
          </Collapsible>
        )}

        {/* Rest menu items */}
        {navItems.slice(1).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center px-2",
            )}
            activeClassName="bg-sidebar-accent text-sidebar-primary shadow-glow"
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />

            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center",
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
            {initials}
          </div>

          {!collapsed && (
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
    </aside>
  );
}
