import { PartialType } from '@nestjs/mapped-types';
import { CreatePhieunhapDto } from './create-phieunhap.dto';

export class UpdatePhieunhapDto extends PartialType(CreatePhieunhapDto) {}
