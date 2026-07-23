import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ApiError, AuthAPI, clearToken, TOKEN_KEY } from "@/lib/api";
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
  const verifiedPath = useRef<string | null>(null);

  // Stabilize permission list so effect does not re-run every render.
  const anyOfKey = useMemo(() => (anyOf?.length ? anyOf.join("|") : ""), [anyOf]);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      if (!token) {
        navigate("/login", { replace: true, state: { from: location.pathname } });
        return;
      }

      // Avoid re-verifying the same path after a successful bootstrap.
      if (verifiedPath.current === location.pathname && ready) {
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
        verifiedPath.current = location.pathname;

        if (!ok) {
          navigate("/", { replace: true });
        }
      } catch (err) {
        const status = err instanceof ApiError ? err.status : 0;

        // Only clear session on definitive auth failure.
        if (status === 401 || status === 403) {
          clearToken();
          navigate("/login", { replace: true, state: { from: location.pathname } });
          return;
        }

        // Network / 5xx / transient: keep token so hard refresh does not log the user out.
        setAllowed(true);
        setReady(true);
        verifiedPath.current = location.pathname;
      }
    };
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- anyOfKey stabilizes anyOf
  }, [
    navigate,
    location.pathname,
    setCurrentRole,
    setPermissions,
    permission,
    anyOfKey,
  ]);

  if (!ready || !allowed) return null;
  return <>{children}</>;
};

export default ProtectedRoute;
