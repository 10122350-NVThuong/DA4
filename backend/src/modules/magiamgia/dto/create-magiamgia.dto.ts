import { IsInt, IsString, IsDate, IsOptional } from 'class-validator';

export class CreateMagiamgiaDto {
  @IsString() Ma: string;
  @IsInt() GiaTri: number;
  NgayBatDau: Date;
  NgayHetHan: Date;

  @IsOptional() @IsInt() GioiHan?: number;
}
