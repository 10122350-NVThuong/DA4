import type { IProduct } from "@/modules/products/types";

export interface IOrderDetail {
  Id: number;
  IdDonHang: number;
  IdSanPham: number;
  SoLuongDat: number;
  GiaCa: number;
  tbl_sanpham?: IProduct;
}

export interface IOrder {
  IdDonHang: number;
  TenNguoiDung: string;
  SoDienThoai: string;
  DiaChi: string;
  TrangThai: string;
  TrangThaiThanhToan: string;
  LoaiDonHang: string;
  TamTinh?: number;
  TongTien: number;
  tbl_chitietdonhang: IOrderDetail[];
}
