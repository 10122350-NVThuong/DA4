import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { NhaCungCapService } from './nhacungcap.service';
import { CreateNhacungcapDto } from './dto/create-nhacungcap.dto';
import { UpdateNhacungcapDto } from './dto/update-nhacungcap.dto';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('nhacungcap')
export class NhaCungCapController {
  constructor(private readonly NhaCungCapService: NhaCungCapService) {}

  @Get()
  findAll() {
    return this.NhaCungCapService.findAll();
  }

  @Get(':IdNhaCungCap')
  findOne(@Param('IdNhaCungCap') IdNhaCungCap: string) {
    return this.NhaCungCapService.findOne(Number(IdNhaCungCap));
  }

  @Post()
  create(@Body() dto: CreateNhacungcapDto) {
    return this.NhaCungCapService.create(dto);
  }

  @Put(':IdNhaCungCap')
  update(
    @Param('IdNhaCungCap') IdNhaCungCap: string,
    @Body() dto: UpdateNhacungcapDto,
  ) {
    return this.NhaCungCapService.update(Number(IdNhaCungCap), dto);
  }

  @Delete(':IdNhaCungCap')
  delete(@Param('IdNhaCungCap') IdNhaCungCap: string) {
    return this.NhaCungCapService.delete(Number(IdNhaCungCap));
  }
}
