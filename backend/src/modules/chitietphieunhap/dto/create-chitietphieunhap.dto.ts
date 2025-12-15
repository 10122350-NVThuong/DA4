import { IsInt, IsOptional } from 'class-validator';

export class CreateChitietphieunhapDto {
  @IsOptional()
  @IsInt()
  IdPhieuNhap?: number;

  @IsOptional()
  @IsInt()
  IdSanPham?: number;

  @IsOptional()
  @IsInt()
  GiaCa?: number;

  @IsOptional()
  @IsInt()
  SoLuongNhap?: number;
}
