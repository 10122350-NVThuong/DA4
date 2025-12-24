import type { IProduct } from "@/modules/products/types";
import type { ISupplier } from "@/modules/suppliers/types";

export interface IInvoiceDetail {
  Id: number;
  IdPhieuNhap: number;
  IdSanPham: number;
  SoLuongNhap: number;
  GiaCa: number;
  tbl_sanpham?: IProduct;
}

export interface IInvoice {
  IdPhieuNhap: number;
  IdNhaCungCap: number;
  NguoiNhap?: string;
  NgayNhap: Date;
  TongTien: number;
  TrangThai: string;
  tbl_chitietphieunhap: IInvoiceDetail[];
  tbl_nhacungcap: ISupplier;
}

export interface IInvoiceDetailForm {
  IdSanPham?: number;
  SoLuongNhap: number;
  GiaCa: number;
}

export interface IInvoiceForm {
  IdNhaCungCap: number;
  NguoiNhap?: string;
  NgayNhap: Date;
  TrangThai: string;
  tbl_chitietphieunhap: IInvoiceDetailForm[];
}
