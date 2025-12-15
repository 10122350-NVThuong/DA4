import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateDanhgiasanphamDto {
  @IsOptional()
  @IsInt()
  IdNguoiDung?: number;

  @IsOptional()
  @IsInt()
  IdSanPham?: number;

  @IsOptional()
  @IsInt()
  SoSao?: number;

  @IsOptional()
  @IsString()
  NoiDung?: string;
}
