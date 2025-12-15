export interface TongQuat {
  TongDoanhThu: number;
  SoDonHang: number;
  SoSanPham: number;
  SoKhachHang: number;
}

export interface DoanhThuDanhMuc {
  TenDanhMucCha: string;
  DoanhThu: number;
}

export interface CountOrder {
  TrangThai: string;
  SoLuong: number;
}

export interface BanChayTheoSoLuong {
  IdSanPham: number;
  TenSanPham: string;
  SoLuong: number;
}

export interface DoanhThuTheoThang {
  Thang: number;
  DoanhThu: number;
}
