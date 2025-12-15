import { PartialType } from '@nestjs/mapped-types';
import { CreateChitietdonhangDto } from './create-chitietdonhang.dto';

export class UpdateChitietdonhangDto extends PartialType(
  CreateChitietdonhangDto,
) {}
