import { IsInt, IsOptional, IsString, IsEnum } from 'class-validator';
import {
  tbl_donhang_TrangThai,
  tbl_donhang_TrangThaiThanhToan,
  tbl_donhang_LoaiDonHang,
} from '@prisma/client';

export class CreateDonhangDto {
  @IsOptional() @IsString() TenNguoiDung?: string;
  @IsOptional() @IsString() SoDienThoai?: string;
  @IsOptional() @IsString() DiaChi?: string;

  @IsOptional()
  @IsEnum(tbl_donhang_TrangThai)
  TrangThai?: tbl_donhang_TrangThai;

  @IsOptional() NgayDat?: Date;

  @IsOptional() @IsInt() TamTinh?: number;
  @IsOptional() @IsInt() IdGiamGia?: number;
  @IsOptional() @IsInt() TongTien?: number;

  @IsOptional()
  @IsEnum(tbl_donhang_TrangThaiThanhToan)
  TrangThaiThanhToan?: tbl_donhang_TrangThaiThanhToan;

  @IsOptional()
  @IsEnum(tbl_donhang_LoaiDonHang)
  LoaiDonHang?: tbl_donhang_LoaiDonHang;

  @IsOptional() @IsInt() IdNguoiDung?: number;
}
