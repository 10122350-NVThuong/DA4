import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { tbl_nguoidung_VaiTro } from '@prisma/client';
export class CreateNguoidungDto {
  @IsOptional()
  @IsString()
  HoTen?: string;

  @IsOptional()
  @IsString()
  SoDienThoai?: string;

  @IsOptional()
  @IsString()
  DiaChi?: string;

  @IsEmail()
  @IsNotEmpty()
  Email: string;

  @IsString()
  @MinLength(6)
  MatKhau: string;

  @IsEnum(tbl_nguoidung_VaiTro)
  @IsOptional()
  VaiTro?: tbl_nguoidung_VaiTro;

  @IsOptional()
  @IsString()
  Avatar?: string;
}
