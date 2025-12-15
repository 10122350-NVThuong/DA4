import { PartialType } from '@nestjs/mapped-types';
import { CreateMagiamgiaDto } from './create-magiamgia.dto';

export class UpdateMagiamgiaDto extends PartialType(CreateMagiamgiaDto) {}
