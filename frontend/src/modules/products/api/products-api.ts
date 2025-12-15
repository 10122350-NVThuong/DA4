import apiClient from "@/lib/api";
import type { IProduct } from "../types";
import { URL_API_GET_PRODUCTS } from "@/constant/config";

export const productApi = {
  getAll: async (): Promise<IProduct[]> => {
    const res = await apiClient.get(URL_API_GET_PRODUCTS);
    return res.data;
  },

  create: async (payload: IProduct) => {
    const res = await apiClient.post(URL_API_GET_PRODUCTS, payload);
    return res.data;
  },

  update: async (id: number, payload: IProduct) => {
    const res = await apiClient.put(`${URL_API_GET_PRODUCTS}/${id}`, payload);
    return res.data;
  },

  delete: async (id: number) => {
    const res = await apiClient.delete(`${URL_API_GET_PRODUCTS}/${id}`);
    return res.data;
  },
};
