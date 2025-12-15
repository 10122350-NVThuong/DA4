import { PartialType } from '@nestjs/mapped-types';
import { CreateDanhgiasanphamDto } from './create-danhgia.dto';

export class UpdateDanhgiasanphamDto extends PartialType(
  CreateDanhgiasanphamDto,
) {}
