import { PartialType } from '@nestjs/mapped-types';
import { CreateNhacungcapDto } from './create-nhacungcap.dto';

export class UpdateNhacungcapDto extends PartialType(CreateNhacungcapDto) {}
