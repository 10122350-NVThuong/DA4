import { URL_API_GET_STATISTICS } from "@/constant/config";
import apiClient from "@/lib/api";

export const dashboardApi = {
  getSalesRevenue: async (from: string, to: string) => {
    const res = await apiClient.get<{
      totalRevenue: number;
      totalInvoices: number;
    }>(`${URL_API_GET_STATISTICS}/sales-revenue`, {
      params: { from, to },
    });
    return res.data;
  },

  getPurchaseRevenue: async (from: string, to: string) => {
    const res = await apiClient.get<{
      totalRevenue: number;
      totalOrders: number;
    }>(`${URL_API_GET_STATISTICS}/purchase-revenue`, {
      params: { from, to },
    });
    return res.data;
  },

  getProfit: async (from: string, to: string) => {
    const res = await apiClient.get<{
      totalSales: number;
      totalPurchases: number;
      profit: number;
    }>(`${URL_API_GET_STATISTICS}/profit`, {
      params: { from, to },
    });
    return res.data;
  },

  getTopProducts: async (from: string, to: string, limit = 10) => {
    const res = await apiClient.get<
      {
        TenSanPham: string;
        SoLuongDat: number;
      }[]
    >(`${URL_API_GET_STATISTICS}/top-products`, {
      params: { from, to, limit },
    });

    return res.data;
  },

  getSalesStatus: async (from: string, to: string) => {
    const res = await apiClient.get<Record<string, number>>(
      `${URL_API_GET_STATISTICS}/sales/status`,
      {
        params: { from, to },
      }
    );
    return res.data;
  },

  getPurchaseStatus: async (from: string, to: string) => {
    const res = await apiClient.get<Record<string, number>>(
      `${URL_API_GET_STATISTICS}/purchase/status`,
      {
        params: { from, to },
      }
    );
    return res.data;
  },

  getDailySalesRevenue: async (from: string, to: string) => {
    const res = await apiClient.get<Record<number, number>>(
      `${URL_API_GET_STATISTICS}/sales/daily`,
      {
        params: { from, to },
      }
    );
    return res.data;
  },

  getDailyPurchaseRevenue: async (from: string, to: string) => {
    const res = await apiClient.get<Record<number, number>>(
      `${URL_API_GET_STATISTICS}/purchase/daily`,
      {
        params: { from, to },
      }
    );
    return res.data;
  },

  compareProfit: async (
    from1: string,
    to1: string,
    from2: string,
    to2: string
  ) => {
    const res = await apiClient.get<{
      profit1: { profit: number };
      profit2: { profit: number };
      diff: number;
      percentChange: number | null;
    }>(`${URL_API_GET_STATISTICS}/profit/compare`, {
      params: { from1, to1, from2, to2 },
    });

    return res.data;
  },
};
