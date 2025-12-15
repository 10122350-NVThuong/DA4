import apiClient from "@/lib/api";
import type { IDanhMuc } from "../types";
import { URL_API_GET_CATEGORIES } from "@/constant/config";

export const danhmucApi = {
  getAll: async (): Promise<IDanhMuc[]> => {
    const res = await apiClient.get<IDanhMuc[]>(URL_API_GET_CATEGORIES);
    return res.data;
  },

  getById: async (id: number): Promise<IDanhMuc> => {
    const res = await apiClient.get<IDanhMuc>(
      `${URL_API_GET_CATEGORIES}/${id}`
    );
    return res.data;
  },

  getChild: async (parentId: number): Promise<IDanhMuc[]> => {
    const res = await apiClient.get(
      `${URL_API_GET_CATEGORIES}/child/${parentId}`
    );
    return res.data;
  },

  getParentCategories: async (): Promise<IDanhMuc[]> => {
    const res = await apiClient.get(`${URL_API_GET_CATEGORIES}/danhmuccha`);
    return res.data;
  },

  create: async (payload: Partial<IDanhMuc>) => {
    const res = await apiClient.post(URL_API_GET_CATEGORIES, payload);
    return res.data;
  },

  update: async (id: number, payload: Partial<IDanhMuc>) => {
    const res = await apiClient.put(`${URL_API_GET_CATEGORIES}/${id}`, payload);
    return res.data;
  },

  delete: async (id: number) => {
    const res = await apiClient.delete(`${URL_API_GET_CATEGORIES}/${id}`);
    return res.data;
  },
};
