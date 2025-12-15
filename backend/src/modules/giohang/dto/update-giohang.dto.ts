import { PartialType } from '@nestjs/mapped-types';
import { CreateGiohangDto } from './create-giohang.dto';

export class UpdateGiohangDto extends PartialType(CreateGiohangDto) {}
