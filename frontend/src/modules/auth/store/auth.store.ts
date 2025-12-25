import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UserRoleObject {
  role?: string;
  role_name?: string;
  name?: string;
}

export interface AuthUser {
  id: number;
  HoTen: string;
  Email: string;
  DiaChi?: string;
  SoDienThoai?: string;
  roles: string | string[] | UserRoleObject[];
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  login: (token: string, user: AuthUser) => void;
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
          user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        });
      },

      hasRole: (role) => {
        return get().hasAnyRole([role]);
      },

      hasAnyRole: (allowedRoles) => {
        const { user } = get();
        if (!user?.roles) return false;

        let roleList: string[] = [];

        if (typeof user.roles === "string") {
          roleList = [user.roles];
        } else if (Array.isArray(user.roles)) {
          roleList = user.roles
            .map((r) => {
              if (typeof r === "string") return r;
              return r.role || r.role_name || r.name || "";
            })
            .filter(Boolean);
        }

        return roleList.some((r) => allowedRoles.includes(r));
      },
    }),
    {
      name: "auth-storage-da4",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
