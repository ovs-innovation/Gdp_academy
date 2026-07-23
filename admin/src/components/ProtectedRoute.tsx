import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthAPI, clearToken, TOKEN_KEY } from "@/lib/api";
import { useRole } from "@/contexts/RoleContext";
import type { Permission } from "@/lib/rbac";

interface Props {
  children: ReactNode;
  permission?: Permission;
  anyOf?: Permission[];
}

const ProtectedRoute = ({ children, permission, anyOf }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentRole, setPermissions } = useRole();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      if (!token) {
        navigate("/login", { replace: true, state: { from: location.pathname } });
        return;
      }
      try {
        const data = await AuthAPI.me();
        if (data.user?.role) {
          if (data.user.role === "Member" || data.user.role === "student") {
            clearToken();
            navigate("/login", {
              replace: true,
              state: {
                from: location.pathname,
                message: "This account cannot access the admin panel.",
              },
            });
            return;
          }
          setCurrentRole(data.user.role);
        }

        if (data.user?.permissions) {
          setPermissions(data.user.permissions as Permission[]);
        }

        const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
        if (data.user?.email) {
          storage.setItem("user-email", data.user.email);
        }
        if (data.user?.name) {
          storage.setItem("user-name", data.user.name);
        }
        if (data.user?.id) {
          storage.setItem("user-id", data.user.id);
        }

        const role = data.user?.role || "";
        const isAdmin = role === "admin" || role === "super_admin";
        const perms = (data.user?.permissions || []) as Permission[];

        let ok = true;
        if (!isAdmin) {
          if (permission) ok = perms.includes(permission);
          else if (anyOf?.length) ok = anyOf.some((p) => perms.includes(p));
        }

        setAllowed(ok);
        setReady(true);

        if (!ok) {
          navigate("/", { replace: true });
        }
      } catch {
        clearToken();
        navigate("/login", { replace: true, state: { from: location.pathname } });
      }
    };
    verify();
  }, [
    navigate,
    location.pathname,
    setCurrentRole,
    setPermissions,
    permission,
    anyOf,
  ]);

  if (!ready || !allowed) return null;
  return <>{children}</>;
};

export default ProtectedRoute;
