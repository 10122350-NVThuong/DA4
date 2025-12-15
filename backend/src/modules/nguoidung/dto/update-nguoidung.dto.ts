import { PartialType } from '@nestjs/mapped-types';
import { CreateNguoidungDto } from './create-nguoidung.dto';

export class UpdateNguoidungDto extends PartialType(CreateNguoidungDto) {}
