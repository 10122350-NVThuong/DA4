import { IsInt, IsOptional } from 'class-validator';

export class CreateGiohangDto {
  @IsOptional() @IsInt() IdNguoiDung?: number;
  @IsOptional() @IsInt() IdSanPham?: number;
  @IsOptional() @IsInt() SoLuong?: number;
  @IsOptional() @IsInt() GiaCa?: number;
}
