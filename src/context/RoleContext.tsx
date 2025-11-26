import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Role as AuthRole } from "./AuthContext";
import { useAuth } from "../hooks/useAuth";
import { getUserRole } from "../services/authService";

export type Role = Exclude<AuthRole, null> | null;

interface RoleContextValue {
  role: Role;
  loading: boolean;
}

const RoleContext = createContext<RoleContextValue>({
  role: null,
  loading: true,
});

export const RoleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) {
        if (mounted) {
          setRole(null);
          setLoading(false);
        }
        return;
      }

      try {
        const r = await getUserRole(user.uid);
        if (mounted) setRole(r ?? null);
      } catch (err) {
        if (mounted) setRole(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (authLoading) {
      setLoading(true);
    }

    load();

    return () => {
      mounted = false;
    };
  }, [user, authLoading]);

  return (
    <RoleContext.Provider value={{ role, loading }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);

export default RoleContext;
