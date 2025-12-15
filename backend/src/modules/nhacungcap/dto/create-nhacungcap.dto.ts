import { IsOptional, IsString } from 'class-validator';

export class CreateNhacungcapDto {
  @IsOptional() @IsString() TenNhaCungCap?: string;
  @IsOptional() @IsString() SoDienThoai?: string;
  @IsOptional() @IsString() Email?: string;
  @IsOptional() @IsString() DiaChi?: string;
}
