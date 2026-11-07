import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useThemeColor, resolveThemeColor } from "@/contexts/ThemeColorContext";
import { AuthAPI, ROLE_KEY, TOKEN_KEY } from "@/lib/api";
import {
  Role,
  Permission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from "@/lib/rbac";

interface RoleContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  permissions: Permission[];
  setPermissions: (perms: Permission[]) => void;
  can: (permission: Permission) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  canAll: (permissions: Permission[]) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const FALLBACK_ADMIN_PERMS: Permission[] = [
  "dashboard.view",
  "users.view",
  "members.view",
  "enquiries.view",
  "enquiries.edit",
  "enquiries.assign",
  "enquiries.delete",
  "roles.view",
  "payments.view",
  "analytics.view",
  "reports.view",
  "blogs.view",
  "gallery.view",
  "cms.view",
  "faqs.view",
  "membershipPlans.view",
  "announcements.view",
  "notifications.view",
  "settings.view",
  "programs.view",
  "categories.view",
];

export function RoleProvider({ children }: { children: ReactNode }) {
  const { setThemeColor } = useThemeColor();

  const [currentRole, setCurrentRoleState] = useState<Role>(
    () => (localStorage.getItem(ROLE_KEY) as Role) || "admin",
  );

  const [permissions, setPermissionsState] = useState<Permission[]>([]);

  const setCurrentRole = useCallback((role: Role) => {
    setCurrentRoleState(role);
    localStorage.setItem(ROLE_KEY, role);
  }, []);

  const setPermissions = useCallback((perms: Permission[]) => {
    setPermissionsState(perms || []);
  }, []);

  useEffect(() => {
    const syncRole = async () => {
      const token =
        localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

      if (!token) return;

      try {
        const data = await AuthAPI.me();

        if (data.user?.role) {
          setCurrentRole(data.user.role);
        } else {
          setCurrentRole("admin");
        }

        if (data.user?.permissions && data.user.permissions.length > 0) {
          setPermissions(data.user.permissions as Permission[]);
        } else {
          setPermissions(FALLBACK_ADMIN_PERMS);
        }

        try {
          const settingsData = await import("@/lib/api").then((m) =>
            m.SettingsAPI.get(),
          );

          if (settingsData?.settings?.themeColor) {
            const mappedColor = resolveThemeColor(settingsData.settings.themeColor);
            setThemeColor(mappedColor);
          }
        } catch {
          // Keep existing themeColor
        }
      } catch {
        // Keep cached role/permissions — never clear auth token here.
        setCurrentRoleState((prev) => prev || "admin");
        setPermissionsState((prev) => (prev.length ? prev : FALLBACK_ADMIN_PERMS));
      }
    };

    syncRole();
  }, [setCurrentRole, setPermissions, setThemeColor]);

  const can = (permission: Permission) => {
    if (currentRole === "admin" || currentRole === "super_admin") return true;
    return hasPermission(permissions, permission);
  };

  const canAny = (perms: Permission[]) => {
    if (currentRole === "admin" || currentRole === "super_admin") return true;
    return hasAnyPermission(permissions, perms);
  };

  const canAll = (perms: Permission[]) => {
    if (currentRole === "admin" || currentRole === "super_admin") return true;
    return hasAllPermissions(permissions, perms);
  };

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        permissions,
        setPermissions,
        can,
        canAny,
        canAll,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);

  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }

  return context;
}