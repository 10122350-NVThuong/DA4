import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateDanhmucDto {
  @IsOptional()
  @IsString()
  TenDanhMuc?: string;

  @IsOptional()
  @IsString()
  MoTa?: string;

  @IsOptional()
  @IsInt()
  ParentID?: number;
}
