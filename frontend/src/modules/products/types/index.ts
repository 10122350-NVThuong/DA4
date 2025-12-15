export interface IProduct {
  IdSanPham?: number;
  TenSanPham: string;
  Gia: number;
  SoLuongTon: number;
  HinhAnh: string;
  ParentID?: number | null;
  IdDanhMuc?: number | null;
}
