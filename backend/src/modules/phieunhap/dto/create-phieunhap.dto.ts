import {
  IsInt,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { tbl_phieunhap_TrangThai } from '@prisma/client';
import { CreateChitietphieunhapDto } from 'src/modules/chitietphieunhap/dto/create-chitietphieunhap.dto';

export class CreatePhieunhapDto {
  @IsOptional()
  @IsInt()
  IdNhaCungCap?: number;

  @IsOptional()
  @IsString()
  NguoiNhap?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  NgayNhap?: Date;

  @IsOptional()
  @IsInt()
  TongTien?: number;

  @IsOptional()
  @IsEnum(tbl_phieunhap_TrangThai)
  TrangThai?: tbl_phieunhap_TrangThai;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChitietphieunhapDto)
  ChiTiet: CreateChitietphieunhapDto[];
}
