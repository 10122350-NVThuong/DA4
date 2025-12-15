import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  user: any | null;
  isAuthenticated: boolean;

  login: (token: string, user: any) => void;
  logout: () => void;

  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) => {
        set({
          accessToken: token,
          user: user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        });
        localStorage.removeItem("auth-storage-da4");
        window.location.href = "/login";
      },

      hasRole: (role) => {
        const { hasAnyRole } = get();
        return hasAnyRole([role]);
      },

      hasAnyRole: (allowedRoles) => {
        const { user } = get();

        if (!user || !user.roles) return false;

        const userRolesList = Array.isArray(user.roles) ? user.roles : [];

        const userRoleStrings = userRolesList.map((r: any) => {
          if (typeof r === "string") return r;
          return r?.role || r?.role_name || r?.name || "";
        });

        return userRoleStrings.some((role) => allowedRoles.includes(role));
      },
    }),
    {
      name: "auth-storage-da4",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
