import { PartialType } from '@nestjs/mapped-types';
import { CreateDonhangDto } from './create-donhang.dto';

export class UpdateDonhangDto extends PartialType(CreateDonhangDto) {}
