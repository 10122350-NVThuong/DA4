import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateSanPhamDto {
  @IsString()
  TenSanPham: string;

  @IsInt()
  Gia: number;

  @IsInt()
  SoLuongTon: number;

  @IsOptional()
  @IsInt()
  ParentID?: number;

  @IsOptional()
  @IsInt()
  IdDanhMuc?: number;

  @IsOptional()
  @IsString()
  HinhAnh?: string;
}
