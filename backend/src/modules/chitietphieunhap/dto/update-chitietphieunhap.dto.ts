import { PartialType } from '@nestjs/mapped-types';
import { CreateChitietphieunhapDto } from './create-chitietphieunhap.dto';

export class UpdateChitietphieunhapDto extends PartialType(
  CreateChitietphieunhapDto,
) {}
