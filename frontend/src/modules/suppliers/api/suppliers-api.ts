import apiClient from "@/lib/api";
import type { ISupplier } from "../types";
import { URL_API_GET_SUPPLIERS } from "@/constant/config";

export const suppliersApi = {
  getAll: async (): Promise<ISupplier[]> => {
    const res = await apiClient.get(URL_API_GET_SUPPLIERS);
    return res.data;
  },

  create: async (payload: ISupplier) => {
    const res = await apiClient.post(URL_API_GET_SUPPLIERS, payload);
    return res.data;
  },

  update: async (id: number, payload: ISupplier) => {
    const res = await apiClient.patch(
      `${URL_API_GET_SUPPLIERS}/${id}`,
      payload
    );
    return res.data;
  },

  delete: async (id: number) => {
    const res = await apiClient.delete(`${URL_API_GET_SUPPLIERS}/${id}`);
    return res.data;
  },
};
