import apiClient from "@/lib/api";
import type { LoginResponse } from "../types";

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },
};
