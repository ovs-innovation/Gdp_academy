import { NavLink } from "@/components/NavLink";
import { useRole } from "@/contexts/RoleContext";
import { useIsMobile } from "@/hooks/use-mobile";
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
import { useEffect, useState } from "react";

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

type AdminSidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export function AdminSidebar({ mobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [ProgramManagementOpen, setProgramManagementOpen] = useState(true);
  const { currentRole } = useRole();
  const isMobile = useIsMobile();

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

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {(!collapsed || isMobile) && (
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

        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="h-10 w-10 text-sidebar-foreground hover:bg-sidebar-accent"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3 admin-mobile-sidebar">
        {navItems.slice(0, 1).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={handleNavClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && !isMobile && "justify-center px-2",
            )}
            activeClassName="bg-sidebar-accent text-sidebar-primary shadow-glow"
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {(!collapsed || isMobile) && <span>{item.label}</span>}
          </NavLink>
        ))}

        {(currentRole === "admin" || currentRole === "super_admin") && (
          <Collapsible
            open={ProgramManagementOpen}
            onOpenChange={setProgramManagementOpen}
            className="space-y-1"
          >
            <CollapsibleTrigger
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && !isMobile && "justify-center px-2",
                ProgramManagementOpen && "bg-sidebar-accent/50",
              )}
            >
              <BookOpen className="h-5 w-5 flex-shrink-0" />
              {(!collapsed || isMobile) && (
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

            {(!collapsed || isMobile) && (
              <CollapsibleContent className="space-y-1 pl-4">
                {ProgramManagementItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={handleNavClick}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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

        {navItems.slice(1).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={handleNavClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && !isMobile && "justify-center px-2",
            )}
            activeClassName="bg-sidebar-accent text-sidebar-primary shadow-glow"
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {(!collapsed || isMobile) && <span>{item.label}</span>}
          </NavLink>
        ))}
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
