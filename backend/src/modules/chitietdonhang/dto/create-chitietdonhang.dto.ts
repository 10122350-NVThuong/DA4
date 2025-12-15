import { IsInt, IsOptional } from 'class-validator';

export class CreateChitietdonhangDto {
  @IsOptional()
  @IsInt()
  IdDonHang?: number;

  @IsOptional()
  @IsInt()
  IdSanPham?: number;

  @IsOptional()
  @IsInt()
  GiaCa?: number;

  @IsOptional()
  @IsInt()
  SoLuongDat?: number;
}
