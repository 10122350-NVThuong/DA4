import apiClient from "@/lib/api";
import type {
  TongQuat,
  DoanhThuDanhMuc,
  CountOrder,
  BanChayTheoSoLuong,
  DoanhThuTheoThang,
} from "../types";

export const dashboardApi = {
  getDoanhThuDanhMuc: async () => {
    const res = await apiClient.get<DoanhThuDanhMuc[]>(
      "/donhang/doanhthudanhmuc"
    );
    return res.data;
  },

  getTongQuat: async () => {
    const res = await apiClient.get<TongQuat[]>("/thongke/tongquat");
    return res.data[0];
  },

  getCountOrder: async () => {
    const res = await apiClient.get<CountOrder[]>("/thongke/demdonhang");
    return res.data;
  },

  getBanChayTheoSoLuong: async () => {
    const res = await apiClient.get<BanChayTheoSoLuong[]>(
      "/thongke/banchaytheosoluong"
    );
    return res.data;
  },

  getDoanhThuTheoThang: async () => {
    const res = await apiClient.get<DoanhThuTheoThang[]>(
      "/thongke/doanhthutheothang"
    );
    return res.data;
  },
};
